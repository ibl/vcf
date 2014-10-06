Template.details.helpers({
  details: function (){
    var z=HeadDetails.find({'title': Session.get("selected_title")}); 
    return z;
  console.log(z);
  }
}
);