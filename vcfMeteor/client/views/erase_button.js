  Template.eraseButton.events({
    'click': function () {
   Meteor.call('removeAllData');
        
    }
    });