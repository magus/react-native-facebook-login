require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name        = 'react-native-facebook-login'
  s.version     = package['version']
  s.summary     = package['description']
  s.homepage    = 'https://github.com/magus/react-native-facebook-login'
  s.license     = package['license']
  s.author      = 'Noah'
  s.platform    = :ios, "8.0"
  s.source      = { :git => "https://github.com/magus/react-native-facebook-login.git", :tag => "#{s.version}" }

  s.source_files  = "RCTFBLogin/*.{h,m}"

  s.dependency "React"
  s.dependency "FBSDKCoreKit"
  s.dependency "FBSDKLoginKit"
end
