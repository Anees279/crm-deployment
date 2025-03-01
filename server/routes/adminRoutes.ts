 import express from 'express';
 import { checkRole } from '../middleware/roleMiddleware';
 import { createUserModel } from '../model/user';
 import mongoose from 'mongoose';
 import router from './authRoutes';

 router.post('/assign-role', checkRole(['admin']), async (req, res) => {
   const { userId, role } = req.body;

   if (!['admin', 'employee', 'client'].includes(role)) {
     return res.status(400).send('Invalid role');
   }

   const user = await createUserModel(req.app.get('mongooseConnection')).findById(userId); // Assuming createUserModel() accepts a mongoose connection
   if (!user) {
     return res.status(404).send('User not found');
   }

   // Ensure req.user exists and is of type IUser
   if (!req.user || !(req.user instanceof mongoose.Types.ObjectId)) {
     return res.status(400).send('Invalid user');
   }

   // Ensure admin can't remove themselves if they're the only admin
   const isSelfAdminChange = 
     req.user._id instanceof mongoose.Types.ObjectId &&
     user._id instanceof mongoose.Types.ObjectId && 
     req.user._id.equals(user._id) && role !== 'admin';

   const adminCount = await createUserModel(req.app.get('mongooseConnection')).countDocuments({ role: 'admin' });

   if (isSelfAdminChange && adminCount <= 1) {
     return res.status(400).send('You cannot remove yourself as admin unless another admin exists');
   }

   user.role = role;
   await user.save();
   req.flash('success', 'Role updated successfully');
   res.redirect('/admin/dashboard');
 });
