var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var User = mongoose.model('User');

var WishSchema = new mongoose.Schema({
  title: String,
  url: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  giver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true});

WishSchema.plugin(uniqueValidator, {message: 'is already taken'});

WishSchema.methods.toJSONFor = function(user) {
  
  return{
    id: this._id,
    title: this.title,
    url: this.url,
    author: this.author.toProfileJSONFor(user),
    giver: this.giver ? this.giver.toProfileJSONFor(user) : this.giver
  };
};

WishSchema.methods.claim = function(user){
	if(!this.giver){
		this.giver = user;
	}
	return this.save();
};

WishSchema.methods.unclaim = function(user){
	if(this.giver && this.giver._id.equals(user._id)){
    this.giver = undefined;
  }
	return this.save();
};

WishSchema.methods.haveClaimed = function(user){
	return(this.giver._id.equals(user._id));
};

mongoose.model('Wish', WishSchema);
