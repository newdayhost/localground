define([
    "jquery",
    "views/profile/listEditView",
    "profile-app",
    "../../../../test/spec-helper"
],
    function ($, ListEditView, ProfileApp) {
        'use strict';
        var profileApp;

        function initApp(scope) {
            var $sandbox = $('<div id="sandbox"></div>'),
                $r1 = $('<div id="region1"></div>'),
                $r2 = $('<div id="region2"</div>'),
                $r3 = $('<div id="region3"></div>');
            $(document.body).append($sandbox);
            $sandbox.append($r1).append($r2).append($r3);

            //add spies for all relevant objects:
            spyOn(ProfileApp.prototype, 'showListView');
            spyOn(ProfileApp.prototype, 'applyFilter');
            spyOn(ProfileApp.prototype, 'clearFilter');

            //initialize app:
            profileApp = new ProfileApp();
            profileApp.start(scope.profileOpts); // defined in spec-helpers:
            console.log(profileApp);
        }

        describe("ProfileApplication: Initialization and Event Handler Tests", function () {
            beforeEach(function () {
                initApp(this);
            });

            afterEach(function () {
                $("#sandbox").remove();
            });

            it("Application initializes subviews successfully", function () {
                expect(profileApp.listEditView).not.toBeNull();
                expect(profileApp.filterView).not.toBeNull();
                expect(profileApp.mainView).not.toBeNull();
                expect(profileApp.sideBarView).not.toBeNull();
            });

            it("Listens to show-list-view and calls correct method", function () {
                profileApp.vent.trigger("show-list-view");
                expect(profileApp.showListView).toHaveBeenCalled();
            });

            it("Listens to apply-filter and calls correct method", function () {
                profileApp.vent.trigger("apply-filter");
                expect(profileApp.applyFilter).toHaveBeenCalled();
            });

            it("Listens to clear-filter and calls correct method", function () {
                profileApp.vent.trigger("clear-filter");
                expect(profileApp.clearFilter).toHaveBeenCalled();
            });

            it("Sets filter correctly", function () {
                profileApp.vent.trigger("clear-filter");
                expect(profileApp.clearFilter).toHaveBeenCalled();
            });

        });
    });
