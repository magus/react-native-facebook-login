var React = require('React');
var NativeModules = require('NativeModules');
var ReactIOSViewAttributes = require('ReactIOSViewAttributes');
var StyleSheet = require('StyleSheet');
var createReactIOSNativeComponentClass = require('createReactIOSNativeComponentClass');
var PropTypes = require('ReactPropTypes');
var LayoutPropTypes = require('LayoutPropTypes');
var StyleSheetPropType = require('StyleSheetPropType');
var NativeMethodsMixin = require('NativeMethodsMixin');
var flattenStyle = require('flattenStyle');
var merge = require('merge');

var FBLoginButton = React.createClass({
  propTypes: {
    style: StyleSheetPropType(LayoutPropTypes),
    permissions: PropTypes.array, // [public_profile, email]
  },

  mixins: [NativeMethodsMixin],

  render: function() {
    var props = {
      ...this.props,
      permissions: this.props.permissions,
      style: ([styles.base, this.props.style]: ?Array<any>),
    };

    return <RCTFBLoginButton {...props} />
  },
});

var RCTFBLoginButton = createReactIOSNativeComponentClass({
  validAttributes: {
    ...ReactIOSViewAttributes.UIView,
    permissions: true,
  },
  uiViewClassName: 'RCTFBLoginButton',
});

var styles = StyleSheet.create({
  base: {
    width: 175,
    height: 30,
  },
});

module.exports = FBLoginButton;
