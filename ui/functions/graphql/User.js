const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      unique: true,
      trim: true
    },
    username: {
      type: String,
      unique: true,
      trim: true
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      required: true
    }
}, {collection: 'Users'});


userSchema.pre('save', function (next) {
    const user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
});

userSchema.statics.authenticate = async function(email, password) {
  try {
    const foundUser = await User.findOne({ email: email });
    
    if (!foundUser) {
        throw Error(`User does not exist.`);
    }

    // console.log('Checking password');
    const match = await bcrypt.compare(password, foundUser.password);

    if (!match) {
        throw Error(`Could not verify username/password.`);
    }

    const user = {
      audience: 'jujujokes',
      role: foundUser.role,
      user_name: foundUser.username,
      user_id: foundUser._id
    };

    const token = foundUser.generate_token();

    return [user, token];

} catch (err) {
    throw Error(err.message);
}
/*  // Old Auth Code.
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    }); */
}

userSchema.methods.generate_token = function() {
  try {
      const newToken = jwt.sign({
          audience: 'jujujokes',
          role: this.role,
          user_name: this.username,
          user_id: this._id
        }, process.env.JWT_SECRET, {
          expiresIn: 604800
      });
      return newToken;
  } catch (err) {
      throw Error(err.message);
  }
};


const User = mongoose.model('User', userSchema);
module.exports = User;