require(['boot'], function () {
    'use strict';
    var specs = [
        // LIB
        'spec/sql-parser-test.js',
        'spec/truth-statement-test.js',
        'spec/data-manager-test.js',
        'spec/snapshot-loader-test.js',

        // MODELS
        'spec/models/layer-test.js',

        // COLLECTIONS
        'spec/collections/base-test.js',
        'spec/collections/layers-test.js',
        'spec/collections/photos-test.js',
        'spec/collections/audio-test.js',
        'spec/collections/prints-test.js',
        'spec/collections/mapimages-test.js',
        'spec/collections/projects-test.js',

        // VIEWS
        'spec/views/basemap-test.js',
        'spec/views/layer-manager-test.js',
        'spec/views/layer-panel-test.js',
        'spec/views/layer-list-test.js',
        'spec/views/symbol-test.js',
        'spec/views/layer-test.js',
        'spec/views/layer-item-test.js',
        'spec/views/caption-test.js',
        'spec/views/fullscreenCtrl-test.js',
        'spec/views/upload-modal-test.js',
        'spec/views/print-form-test.js',
        'spec/views/print-mockup-test.js',
        'spec/views/photo-bubble-test.js',

        //PROFILE VIEWS
        'spec/views/profile/profile-app-test.js',
        'spec/views/profile/list-edit-view-test.js',
        'spec/views/profile/side-bar-view-test.js',
        'spec/views/profile/filter-view-test.js',
        'spec/views/profile/edit-item-view-test.js'//,
        //'spec/views/audio-player-test.js'
    ];

    require(specs, function () {
        window.executeTests();
    });
});
