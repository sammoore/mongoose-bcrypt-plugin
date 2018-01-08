# mongoose-bcrypt-plugin

A mongoose plugin for adding fields to a schema whose data is encrypted via
bcrypt upon pre-`#save` middleware.

This code technically runs in the wild, but was recently refactored and has no tests (_yet_). Use at your own risk.

## Usage

Adding a field to a schema is simple:

```javascript
'use strict';

const assert = require('assert');
const mongoose = require('mongoose');
const bcrypt = require('mongoose-bcrypt-plugin');

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  }
});

schema.plugin(bcrypt('password'), {
  // additional options for the field
  required: true
});

const User = mongoose.model('User', schema);
```

Once added, there will be an additional instance method, `.compareFieldName`,
where `FieldName` is a capitalized version of the key used with the plugin:

```javascript
const username = 'samtheprogram';
const password = 'password';

new User({ username, password }).save().then((user) => {
  assert.ok(user.password != password);

  User.findOne({ username }).exec().then((user) => {
    user.comparePassword(password).then(() => {
      assert.ok();
    });

    user.comparePassword('wrong').catch((err) => {
      assert.ok(err instanceof User.BcryptPluginError);
    });
  });
});
```

## Roadmap

- [ ] support for `#update` and similar middleware
- [ ] utilizing a custom SchemaType instead-of / in-conjunction-with a plugin. 

## License

    Copyright 2018 Samuel Moore
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
        http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

