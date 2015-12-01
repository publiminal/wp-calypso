var React = require( 'react' );

/**
 * Internal dependencies
 */
var StepWrapper = require( 'signup/step-wrapper' ),
	analytics = require( 'analytics' ),
	SignupActions = require( 'lib/signup/actions' ),
	Theme = require( 'components/theme' ),
	ThemeHelper = require( 'lib/themes/helpers' );

module.exports = React.createClass( {
	displayName: 'MlbThemeSelection',
	getDefaultProps: function() {
		var props = {
			variations: [ 'Fan', 'Modern', 'Retro' ],
			teams: {
				mlb: 'MLB',
				'minor-league': 'MiLB.com',
				diamondbacks: 'Arizona Diamondbacks',
				braves: 'Atlanta Braves',
				orioles: 'Baltimore Orioles',
				redsox: 'Boston Red Sox',
				cubs: 'Chicago Cubs',
				whitesox: 'Chicago White Sox',
				reds: 'Cincinnati Reds',
				indians: 'Cleveland Indians',
				rockies: 'Colorado Rockies',
				tigers: 'Detroit Tigers',
				astros: 'Houston Astros',
				royals: 'Kansas City Royals',
				angels: 'Los Angeles Angels',
				dodgers: 'Los Angeles Dodgers',
				marlins: 'Miami Marlins',
				brewers: 'Milwaukee Brewers',
				twins: 'Minnesota Twins',
				mets: 'New York Mets',
				yankees: 'New York Yankees',
				athletics: 'Oakland Athletics',
				phillies: 'Philadelphia Phillies',
				pirates: 'Pittsburgh Pirates',
				padres: 'San Diego Padres',
				giants: 'San Francisco Giants',
				mariners: 'Seattle Mariners',
				cardinals: 'St. Louis Cardinals',
				rays: 'Tampa Bay Rays',
				rangers: 'Texas Rangers',
				bluejays: 'Toronto Blue Jays',
				nationals: 'Washington Nationals'
			}
		};
		props.themes_ = Object.keys( props.teams );
		return props;
	},

	getInitialState: function() {
		return {
			team: 'mlb'
		};
	},

	handleTeamSelect: function( event ) {
		event.preventDefault();
		this.setState( { team: event.target.value } );
	},

	getThumbnailUrl: function( team, variation ) {
		var url = 'https://i1.wp.com/s0.wp.com/wp-content/themes/vip/partner-' +
			team + '-' + ThemeHelper.getSlugFromName( variation ) + '/screenshot.png?w=660';
		if ( team !== 'mlb' ) {
			url = 'https://signup.wordpress.com/wp-content/mu-plugins/signup-variants/mlblogs/images/themes/' +
				ThemeHelper.getSlugFromName( variation ) + '/' + team + '.jpg';
		}
		return url;
	},

	handleSubmit: function( variation ) {
		var themeSlug;

		themeSlug = 'partner-mlb-' + ThemeHelper.getSlugFromName( variation );

		analytics.tracks.recordEvent( 'calypso_signup_theme_select', { theme: themeSlug, headstart: false } );
		SignupActions.submitSignupStep( {
			stepName: this.props.stepName,
			processingMessage: this.translate( 'Adding your theme' ),
			themeSlug
		} );

		this.props.goToNextStep();
	},

	renderThemes: function() {
		return (
			<div>
				<div>
					<fieldset className="form-fieldset">
						<label htmlFor="team-field">{ this.translate( 'Your team' ) }</label>
						<select onChange={ this.handleTeamSelect } name="team-field">
							{ Object.keys( this.props.teams ).map( ( key ) => {
								let team = this.props.teams[ key ];
								return <option key={ key } value={ key }>{ team }</option>;
							}.bind( this ) ) }
						</select>
					</fieldset>
				</div>
				<h3>{ this.translate( 'Theme' ) }</h3>
				<div className="mlb-theme-selection">
					{ this.props.variations.map( function( variation ) {
						return (
							<Theme
								id = { 'partner-' + this.state.team + '-' + ThemeHelper.getSlugFromName( variation ) }
								key={ variation }
								name={ variation }
								actionLabel= { this.translate( 'Pick' ) }
								screenshot={ this.getThumbnailUrl( this.state.team, variation ) }
								onScreenshotClick = { this.handleSubmit.bind( null, variation ) }
							/>
						);
					}.bind( this ) ) }
				</div>
				<div className="mlb-themes__terms">
					<h2>{ this.translate( 'MLB.com/blogs Rules' ) } </h2>
					<p>
						{ this.translate( 'By selecting a theme or clicking Skip, you understand that activating an MLB.com/blogs account indicates your acceptance of the {{a}}Terms of Use{{/a}}', {
							components: {
								a: <a href="http://mlb.mlb.com/mlb/official_info/about_mlb_com/terms_of_use.jsp" target="_blank" />
							}
						} ) }
					</p>
				</div>
			</div>
		);
	},

	render: function() {
		return (
			<StepWrapper
				headerText={ this.translate( 'Welcome to MLB.com/blogs.' ) }
				fallbackHeaderText={ this.translate( 'Register.' ) }
				fallbackSubHeaderText={ this.translate( 'No need to overthink it. You can always switch to a different theme\u00a0later.' ) }
				subHeaderText={ this.translate( 'After choosing your team and theme below you\'ll be ready to start blogging.' ) }
				stepContent={ this.renderThemes() }
				{ ...this.props } />
		);
	}
} );
