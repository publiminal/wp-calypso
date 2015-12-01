# Action Poller

Wraps a componet and runs a given action at a given interval while that component is mounted. This component mimicks the data poller component, but doesn't require any connecting data store. The action poller could be used for any action and was designed with Flux-like actions in mind, _e.g._ for running a background fetch to update a store.

## Usage

## Examples

### Poor-man's observable

Somehow a variable inside a component is changing and it isn't clear when it changes or why. Let's watch it for changes...

```js
import ActionPoller from 'lib/action-poller';

watchThatThang() {
	if ( this.oldValue !== this.state.thang ) {
		console.log( `thang was ${ this.oldValue } but is now ${ this.state.thang }!` );
		this.oldValue = this.state.thang;
	}
}

render: () => (
	<ActionPoller action={ this.watchThatThang } interval="20">
		<NormalComponentTree />
	</ActionPoller>
)
```

### Flux action timer

A more useful case for this poller is to fire off Flux-like actions at intervals while a given component is mounted (or in view). In this example, let's build a sound device that plays music but automatically changes the station every fifteen minutes. We don't want to stop changing the station just because the player isn't visible on the screen. In fact, we don't want visibility to have anything to do with this, so we add a couple extra props.

```js
import ActionPoller from 'lib/action-poller';
import { randomizeMusic } from './actions';
import soundStore from './store';

render: () => (
	<ActionPoller
		action={ randomizeMusic }
		leading={ false }
		pauseWhenHidden={ false }
		interval={ 15 * MINUTE_IN_MS }
	>
		<Provider store={ soundStore }>
			<SoundLoop autostart={ true } />
		</Provider>
	</ActionPoller>
)
```