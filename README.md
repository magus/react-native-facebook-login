# toy

## setup

There are two branches, a development branch (`master`) and a publish branch (`publish`). `publish` will modify the `iOS/AppDelegate.m` file to correctly point to the local js bundle `iOS/main.jsbundle`. The command below will setup a post-checkout hook which will automatically update the js bundle.
```sh
ln -s $(pwd)/post-checkout .git/hooks/post-checkout
```
