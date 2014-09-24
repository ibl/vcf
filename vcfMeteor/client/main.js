if (Meteor.isClient) {

  Meteor.startup(function() {

    return Meteor.methods({

      removeAllData: function() {

        Body.remove({});
        Head.remove({});
        HeadDetails.remove({});

      }

    });

  });

}
//export MONGO_URL='mongodb://diego:ismism@oceanic.mongohq.com:10028/vcf'