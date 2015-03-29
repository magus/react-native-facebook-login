# toy

## setup

Modify the `iOS/AppDelegate.m` file to correctly point to the local js bundle `iOS/main.jsbundle` or the bundle served by packager.

The script below will automatically update the js bundle.
```sh
$(git rev-parse --show-toplevel)/updateBundle.sh
```

The command below will setup a pre-commit hook to call the above script
```sh
ln -s $(git rev-parse --show-toplevel)/updateBundle.sh .git/hooks/pre-commit
```
