define(['backbone', 'spin'], function(Backbone, Spinner){

	
	return Backbone.View.extend({

		className: 'notification',

		defaults: {
			duration: 2000,
			autoDismiss: true,
			type: 'info',
			showSpin: false
		},

		initialize: function(options){
			_.extend(this, this.defaults, options);

			this.el.classList.add(this.type);

			this.el.innerHTML = options.message;

			document.body.appendChild(this.el);

			if (this.showSpin) this.spinner = new Spinner({
				left: '20px',
				lines: 7,
				speed: 1.3,
				length: 3,
				radius: 3,
				color: '#666'
			}).spin(this.el);
		},

		remove: function(){
			if (this.timeout) {
				clearTimeout(this.timeout);
			};

			if (this.spinner) this.spinner.stop();

			Backbone.View.prototype.remove.call(this, arguments);
		},

		show: function(){
			this.el.classList.add('active');

			if (this.autoDismiss) {
				var me = this;
				this.timeout = setTimeout(function(){
					me.dismiss();
				}, this.duration);
			};
		},

		dismiss: function(){
			this.el.classList.remove('active');

			var me = this;
			var onTransitionEnd = function(){
				me.el.removeEventListener('webkitTransitionEnd', onTransitionEnd);
				me.el.removeEventListener('msTransitionEnd', onTransitionEnd);
        me.el.removeEventListener('oTransitionEnd', onTransitionEnd);
        me.el.removeEventListener('otransitionend', onTransitionEnd);
        me.el.removeEventListener('transitionend', onTransitionEnd);
				me.remove();

				if (me.onDismiss) me.onDismiss();
			}

			this.el.addEventListener('webkitTransitionEnd', onTransitionEnd);
			this.el.addEventListener('msTransitionEnd', onTransitionEnd);
      this.el.addEventListener('oTransitionEnd', onTransitionEnd);
      this.el.addEventListener('otransitionend', onTransitionEnd);
      this.el.addEventListener('transitionend', onTransitionEnd);
		}

	}, {
		show: function(options){
			var n = new this(options);
			setTimeout(function(){
				n.show();
			}, 0);

			return n;
		}
	});
});
