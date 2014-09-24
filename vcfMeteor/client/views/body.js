Template.body.helpers({
  bodyTitle: function (){
    var z = Body.find().fetch();
    
    return z.slice(0,10) //workaroud to abscence of limit() on meteor collections
  }
});