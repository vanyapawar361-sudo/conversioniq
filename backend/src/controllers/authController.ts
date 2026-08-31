import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Company, Organization } from '../models/Company';
import { generateAccessToken, generateRefreshToken } from '../utils/auth';

import { Invitation } from '../models/Invitation';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, companyName, organizationName, inviteToken } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const nameOfCompany = companyName || organizationName;
    let companyId: string;
    let role = 'Owner';

    if (inviteToken) {
      const invitation = await Invitation.findOne({ token: inviteToken, status: 'pending', expiresAt: { $gt: new Date() } });
      if (!invitation) {
        return res.status(400).json({ message: 'Invalid or expired invitation token.' });
      }
      companyId = invitation.organizationId.toString();
      role = invitation.role;
      // Mark invitation accepted
      invitation.status = 'accepted';
      await invitation.save();
    } else {
      // Create company first
      if (!nameOfCompany) {
        return res.status(400).json({ message: 'Company name is required.' });
      }
      const company = new Company({ name: nameOfCompany });
      await company.save();
      companyId = company._id.toString();
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      passwordHash: hashedPassword,
      companyId,
      organizationId: companyId,
      role
    });

    const refreshToken = generateRefreshToken(user._id.toString(), companyId, role, companyId);
    user.refreshToken = refreshToken;
    await user.save();

    const accessToken = generateAccessToken(user._id.toString(), companyId, role, companyId);

    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        companyId: companyId,
        organizationId: companyId,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const compId = (user.companyId || user.organizationId).toString();
    const accessToken = generateAccessToken(user._id.toString(), compId, user.role, compId);
    const refreshToken = generateRefreshToken(user._id.toString(), compId, user.role, compId);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        companyId: compId,
        organizationId: compId,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token' });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const compId = (user.companyId || user.organizationId).toString();
    const accessToken = generateAccessToken(user._id.toString(), compId, user.role, compId);
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

import crypto from 'crypto';
import { sendPasswordResetEmail } from '../utils/mailer';

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // Return success to prevent email enumeration
      return res.status(200).json({ message: 'If that email exists, we sent a recovery link.' });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    let mailResult: any;
    try {
      mailResult = await sendPasswordResetEmail(user.email, resetUrl);
    } catch (e: any) {
      console.error('Failed to send mail:', e);
      mailResult = { devMode: true };
    }

    // In dev mode or if email failed to dispatch, return the reset URL directly in the response
    if (mailResult && mailResult.devMode) {
      return res.status(200).json({
        message: 'Email delivery pending. Use the reset URL below to set your password.',
        devMode: true,
        resetUrl,
      });
    }

    res.status(200).json({ message: 'Password reset link sent successfully.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to process password reset.' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(password, 12);
    user.passwordHash = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Failed to reset password.' });
  }
};

