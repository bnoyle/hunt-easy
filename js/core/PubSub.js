define([
	'backbone'
], function(Backbone) {
	return _.extend({}, Backbone.Events, {
		isMatch: function(msg, msgType, props) {
			if (msg.type != msgType)
				return false;
			if (props) {
				for (var p in props) {
					if (msg.data[p] != props[p])
						return false;
				}
			}
			return true;
		},
		waitFor: function(msgType, props, cb) {
			var me = this;
			var fireIfMatch = function(data) {
				if (!me.isMatch(data, msgType, props))
					return;

				this.off('app:message:' + msgType, fireIfMatch);
				return cb(data);
			};

			this.on('app:message:' + msgType, fireIfMatch);
		},
		wait: function(topic, cb) {
			var me = this;
			var fire = function() {
				this.off(topic, fire);
				return cb.apply(this, arguments);
			};

			this.on(topic, fire);
		},
		trigger: function(name) {
			console.log('pub... ' + name);
			return Backbone.Events.trigger.apply(this, arguments);
		},
		on: function(name, callback, context) {
			//console.log('sub...' + name);
			return Backbone.Events.on.apply(this, arguments);
		}
	});
});
