const router = require('express').Router();

const {
  getUsers, getUserById, getCurrentUser, createUser, updateProfile, updateAvatar,
} = require('../controllers/users');

router.get('/me', getCurrentUser);

router.get('/', getUsers);

router.get(
  '/:userId',
  getUserById,
);

router.post('/', createUser);

router.patch(
  '/me',
  updateProfile,
);

router.patch(
  '/me/avatar',
  updateAvatar,
);

module.exports = router;
