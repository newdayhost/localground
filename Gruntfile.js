module.exports = function(grunt) {
    grunt.initConfig({
	    requirejs: {
	        mapplication: {
	        	options: {
	        		out:'./static/backbone/js/api-build/mapplication.js',
	        		baseUrl: "./static/backbone/js/api",
	        		mainConfigFile: "./static/backbone/js/api/base.js",
	        		name:'mapplication',
	        		removeCombined: 'true',
	        		findNestedDependencies: 'true',
	        		wrapShim: 'true',
	        		optimize: 'none'
	        	}
	        },
	        print: {
	        	options: {
	        		out:'./static/backbone/js/api-build/print_base.js',
	        		baseUrl: "./static/backbone/js/api",
	        		mainConfigFile: "./static/backbone/js/api/base.js",
	        		name:'print_base',
	        		removeCombined: 'true',
	        		findNestedDependencies: 'true',
	        		wrapShim: 'true',
	        		optimize: 'none'
	        	}
	        },
	        embeddedMapplication: {
	        	options: {
	        		out:'./static/backbone/js/api-build/embedded-mapplication.js',
	        		baseUrl: "./static/backbone/js/api",
	        		mainConfigFile: "./static/backbone/js/api/base.js",
	        		name:'embedded-mapplication',
	        		removeCombined: 'true',
	        		findNestedDependencies: 'true',
	        		wrapShim: 'true',
	        		optimize: 'none'
	        	}
	        }
		    
		}

    });
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.registerTask('default', 'requirejs');

};
