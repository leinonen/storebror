(function () {

  'use strict';

  angular.module('app')
    .controller('ClientDetailsCtrl', function ($rootScope, ClientService) {

      var controller = this;
      controller.client = {};
      controller.services = {};
      controller.editMode = false;

      $rootScope.$on('LoadClient', function (event, id) {

        ClientService.getClient(id).then(function (client) {
          controller.client = client;
          controller.services = {
            active: controller.client.services.filter(function (service) {
              return service.running === true && service.name !== '';
            }),
            inactive: controller.client.services.filter(function (service) {
              return service.running === false && service.name !== '';
            })
          }
        })
      });


      controller.showServices = false;
      controller.showFilesystems = false;

      controller.toggleServices = function () {
        controller.showServices = !controller.showServices;
      };

      controller.toggleFilesystems = function () {
        controller.showFilesystems = !controller.showFilesystems;
      };

      controller.toggleEdit = function () {
        if (controller.editMode) {
          ClientService.updateClient(controller.client._id, controller.client).then(function (cli) {
            controller.client = cli;
            console.log('save successful!');
          });
        }
        controller.editMode = !controller.editMode;
      }

    });

})();