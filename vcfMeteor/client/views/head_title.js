  Template.headTitleContent.events({
    'click': function () {
      Session.set("selected_title", this.title);
      console.log(Session.get("selected_title"))
    }
  });