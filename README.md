# toy

## setup

Modify the `iOS/AppDelegate.m` file to correctly point to the local js bundle `iOS/main.jsbundle` or the bundle served by packager.

The command below will setup a post-commit hook which will automatically update the js bundle.
```sh
ln -s $(pwd)/pre-commit .git/hooks/pre-commit
```
