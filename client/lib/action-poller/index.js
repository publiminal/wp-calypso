import React, { PropTypes } from 'react';

/**
 * Calls a given function on a given interval
 */
export default React.createClass( {
	displayName: 'ActionPoller',

	propTypes: {
		action: PropTypes.func.isRequired,
		interval: PropTypes.number,
		leading: PropTypes.bool,
		pauseWhenHidden: PropTypes.bool,
		children: PropTypes.element
	},

	getDefaultProps: () => ( {
		interval: 30000,
		leading: true,
		pauseWhenHidden: true
	} ),

	getInitialState: () => ( {
		timer: null
	} ),

	componentDidMount() {
		this.start()
	},

	componentWillUnmount() {
		this.stop()
	},

	componentDidUpdate() {
		this.start();
	},

	run() {
		clearTimeout( this.state.timer );

		if ( document.hidden && this.props.pauseWhenHidden ) {
			return this.setState( { timer: null } );
		}

		this.setState( { timer: setTimeout( this.run, this.props.interval ) } );

		this.props.action();
	},

	start() {
		return ! this.state.timer && this.setState( {
			timer: setTimeout( this.run, this.props.leading ? 0 : this.props.interval )
		} );
	},

	stop() {
		this.setState( { timer: clearTimeout( this.state.timer ) } );
	},

	render() {
		return this.props.children;
	}
} );
