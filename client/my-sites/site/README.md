Site (JSX)
==========

This component displays a Site item using the data structure provided by sites-list. It's used to display context and to render the picker.

#### How to use:

```js
var Site = require( 'my-sites/site' );

render: function() {
	return (
		<Site site={ siteObject } />
	);
}
```

#### Props

* `site (object)` - A site object from `sites-list`. It's required.
* `indicator (bool)` - Whether to display the Site Indicator within the item or not.
* `onSelect (func)` - A function to handle the event callback when clicking/tapping on the site.
* `href (string)` - A URL to add to the anchor.
* `isSelected (bool)` - Whether the site should be marked as selected.