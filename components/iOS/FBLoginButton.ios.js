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
    param: PropTypes.string,
  },

  mixins: [NativeMethodsMixin],

  viewConfig: {
    uiViewClassName: 'UIView',
    validAttributes: ReactIOSViewAttributes.UIView
  },

  render: function() {
    var style = flattenStyle([styles.base, this.props.style]);

    var nativeProps = merge(this.props, {
      style,
      param: this.props.param,
    });

    return <RCTFBLoginButton {... nativeProps} />
  },
});

var RCTFBLoginButton = createReactIOSNativeComponentClass({
  validAttributes: merge(ReactIOSViewAttributes.UIView, {param: true}),
  uiViewClassName: 'RCTFBLoginButton',
});

var styles = StyleSheet.create({
  base: {
    width: 175,
    height: 30,
  },
});

module.exports = FBLoginButton;
