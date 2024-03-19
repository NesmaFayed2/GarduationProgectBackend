const slugify = require('slugify');
const bcrypt = require('bcryptjs');
const { body,check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/user.model');
const jwt=require('jsonwebtoken');


exports.SignUpValidator = [
  check('name')
    .notEmpty()
    .withMessage('User required')
    .isLength({ min: 3 })
    .withMessage('Too short User name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('E-mail already in user'));
        }
      })
    ),

  check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .custom((password, { req }) => {
      if (!(password == req.body.passwordConfirm)) {
        
        throw new Error('Password Confirmation incorrect');
        
      }
      return true;
    }),

  check('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation required'),

  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

  check('profileImg').optional(),
  check('role').optional(),

  check('anothermail')
  .optional()
  .isEmail()
  .withMessage('Invalid email address'),
  
  check('anotherphone').optional()
  .isMobilePhone(['ar-EG', 'ar-SA'])
  .withMessage('Invalid phone number only accepted Egy and SA Phone numbers')
  
  ,

  validatorMiddleware,
];



exports.LogInValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    ,

  check('password')
    .notEmpty()
    .withMessage('Password required')
    ,


  validatorMiddleware,
];


exports.editUsernameValidator= [ 
  body('name')
    .notEmpty().withMessage('Name required')
    .custom((val, { req }) => {  
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.editemailValidator=[ 

check('email')
.notEmpty()
.withMessage('Email required')
.isEmail()
.withMessage('Invalid email address')
.custom((val) =>
  User.findOne({ email: val }).then((user) => {
    if (user) {
      return Promise.reject(new Error('E-mail already in user'));
    }
  })
)
,validatorMiddleware
];

exports.anoteremailValidator=[ 

  check('anothermail')
  .notEmpty()
  .withMessage('Email required')
  .isEmail()
  .withMessage('Invalid email address')
  ,validatorMiddleware
  ];

  exports.anoterphoneValidator=[ 
    check('anotherphone').optional()
  .isMobilePhone(['ar-EG', 'ar-SA'])
  .withMessage('Invalid phone number only accepted Egy and SA Phone numbers')
    ,validatorMiddleware
    ];




exports.editphoneValidator=[
  check('phone')
    .notEmpty()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),
    validatorMiddleware
];


exports.changeUserPasswordValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),

  body('currentPassword')
    .notEmpty()
    .withMessage('You must enter your current password')
    .custom(async (val, { req }) => {
      // 1) Verify current password
      const user = await User.findById(req.params.id);  
      
      if (!user) {
        throw new Error('There is no user for this id');
      }
      const current=user.password;                                                          
      const isCorrectPassword = await bcrypt.compareSync( 
        val,
        current 
      ); 
      if (!isCorrectPassword) {
        throw new Error('Incorrect Current password ');
      }})
    ,

  body('passwordConfirm')
    .notEmpty()
    .withMessage('You must enter the password confirm'),

  body('password')
    .notEmpty()
    .withMessage('You must enter new password')
    .custom(async (val, { req }) => {
      // 2) Verify password confirm
      if (val !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');
      }
      return true;
    })
    ,
  validatorMiddleware,
];

exports.changeLoggedUserPasswordValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),

  body('currentPassword')
    .notEmpty()
    .withMessage('You must enter your current password')
    .custom(async (val, { req }) => {

     

      // 1) Verify current password
      const user = await User.findById(req.user._id);  
      
      if (!user) {
        throw new Error('You must login');
      }
      const current=user.password;                                                          
      const isCorrectPassword = await bcrypt.compareSync( 
        val,
        current 
      ); 
      if (!isCorrectPassword) {
        throw new Error('Incorrect Current password ');
      }})
    ,

  body('passwordConfirm')
    .notEmpty()
    .withMessage('You must enter the password confirm'),

  body('password')
    .notEmpty()
    .withMessage('You must enter new password')
    .custom(async (val, { req }) => {
      // 2) Verify password confirm
      if (val !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');
      }
      return true;
    })
    ,
  validatorMiddleware,
];














