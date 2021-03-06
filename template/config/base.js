
module.exports = {

	// 
	// Logging configuration
	// 
	logging: {
		level: ['MESSAGE', 'WARNING', 'ERROR', 'CRITICAL'],
		timestamps: true,
		colorOutput: true,
		requests: {
			enabled: true,
			body: false,
			headers: true,
			sockets: true
		}
	},

	// 
	// HTTP server configuration
	// 
	http: {
		// If disabled, the server acts as a socket-only server, and all non-socket
		// related requests will fail with a 501 Not Implemented error. The rest of
		// the http config is still request as an http server handles socket requests
		// as well
		enabled: true,

		port: 3000,
		address: '0.0.0.0'
	},

	// 
	// Web socket configuration
	// 
	ws: {
		enabled: false,

		// Should socket-based push listeners be allowed
		enablePushSupport: false,
		
		// The store to be used by socket.io (memory/redis)
		store: 'memory',

		// These settings are passed directly into socket.io
		socketIO: {
			resource: '/socket.io'
		}
	},

	// 
	// SSL configuration
	// 
	ssl: {
		enabled: false,

		keyFile: './ssl/key',
		certFile: './ssl/cert',
		caFile: './ssl/ca'
	},
	
	// 
	// Redis is used in dagger as a pub-sub event bus for communicating certain events
	// between multiple instances of your application. If you only intend on running a
	// single instance, you can disable this.
	// 
	redis: {
		enabled: false,
		url: 'redis://localhost',
		channel: 'dagger',
	},

	// 
	// MongoDB is used for storing all of the persistent data for your application.
	// 
	mongodb: {
		url: 'mongodb://localhost'
	},

	// 
	// Config for response formatting and contents
	// 
	output: {
		meta: false,
		errorStacks: false,
		schemaEndpoints: true
	}

};
