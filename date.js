
module.exports.getDate = function(){
const options = {
    weekday:"long",
    day:"numeric",
    month:"long",

  };


  const today = new Date();
  return today.toLocaleDateString("en-in",options);

}


module.exports.getDay = function(){

const options = {
    weekday:"long",
  };


  const today = new Date();
  return today.toLocaleDateString("en-in",options);

}

console.log(module);



// class CreateUserDetails < ActiveRecord::Migration[7.0]
//   def change
//     create_table :user_details do |t|
//       t.string :name
//       t.string :adress
//       t.string :email
//       t.string :password

//       t.timestamps
//     end
//   end
// end