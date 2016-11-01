# Spawn.js
#### Management of Application state... 
(subscription on the data bit)

![Spaun.js](http://2.bp.blogspot.com/_sBl2KZslg98/S_zpYQ4-mFI/AAAAAAAAAD0/5HAjyKHqt7w/s1600/spawn04.jpg)

```
bower install spawn.js --save
```

```html
<script src="bower_components/spawn.js/spawn.min.js"></script>
```

```javascript
var spawn$ = new Spawn();

function callback() {
    var admins = spawn$.getState().users.admins;
    console.log('admin name: ', admins[0].name);
}

//subscribe
spawn$.detect('users.admins', callback);

//update
spawn$.update('users', {
	admins: [
		{ id: 0, name: 'John' },
		{ id: 1, name: 'Alex' }
	]
});
//console output: 'admin name: John'

setTimeout(function() {
	spawn$.update('users', {
		admins: [
			{ id: 0, name: 'Jess' },
			{ id: 1, name: 'Alex' }
		]
	});
}, 2000);

//console output: 'admin name: Jess'
```
