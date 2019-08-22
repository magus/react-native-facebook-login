require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = package['name']
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']

  s.authors      = package['author']
  s.homepage     = package['homepage']
  s.platform     = :ios, "9.0"

  s.source       = { :git => "https://github.com/magus/react-native-webview-bridge.git", :tag => "v#{s.version}" }
  s.source_files  = "RCTFBLogin/*.{h,m}"

  s.dependency 'React'
  s.dependency 'FBSDKCoreKit', '~> 4.40.0'
  s.dependency 'FBSDKLoginKit', '~> 4.40.0'
end
