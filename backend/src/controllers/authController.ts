import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Organization } from '../models/Organization';
import { generateAccessToken, generateRefreshToken } from '../utils/auth';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, organizationName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create organization first
    const organization = new Organization({ name: organizationName });
    await organization.save();

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      passwordHash: hashedPassword,
      organizationId: organization._id,
      role: 'Admin'
    });

    const refreshToken = generateRefreshToken(user._id.toString(), organization._id.toString());
    user.refreshToken = refreshToken;
    await user.save();

    const accessToken = generateAccessToken(user._id.toString(), organization._id.toString());

    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        organizationId: user.organizationId
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

    const accessToken = generateAccessToken(user._id.toString(), user.organizationId.toString());
    const refreshToken = generateRefreshToken(user._id.toString(), user.organizationId.toString());

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        organizationId: user.organizationId
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

    const accessToken = generateAccessToken(user._id.toString(), user.organizationId.toString());
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
