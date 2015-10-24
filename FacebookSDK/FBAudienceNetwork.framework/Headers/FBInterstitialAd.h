// Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
//
// You are hereby granted a non-exclusive, worldwide, royalty-free license to use,
// copy, modify, and distribute this software in source code or binary form for use
// in connection with the web services and APIs provided by Facebook.
//
// As with any software that integrates with the Facebook platform, your use of
// this software is subject to the Facebook Developer Principles and Policies
// [http://developers.facebook.com/policy/]. This copyright notice shall be
// included in all copies or substantial portions of the software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

#import <Foundation/Foundation.h>
#import <StoreKit/StoreKit.h>

#import "FBAdDefines.h"
#import "FBAdView.h"

@protocol FBInterstitialAdDelegate;

/*!
 @class FBInterstitialAd

 @abstract A modal view controller to represent a Facebook interstitial ad. This
 is a full-screen ad shown in your application.
 */
FB_CLASS_EXPORT
@interface FBInterstitialAd : UIViewController <FBAdViewDelegate>

/*!
 @property
 @abstract Typed access to the id of the ad placement.
 */
@property (nonatomic, copy, readonly, nonnull) NSString *placementID;
/*!
 @property
 @abstract the delegate
 */
@property (nonatomic, weak, nullable) id<FBInterstitialAdDelegate> delegate;

/*!
 @method

 @abstract
 This is a method to initialize an FBInterstitialAd matching the given placement id.

 @param placementID The id of the ad placement. You can create your placement id from Facebook developers page.
 */
- (nonnull instancetype)initWithPlacementID:(nonnull NSString *)placementID;

/*!
 @property

 @abstract
 Returns true if the interstitial ad has been successfully loaded.

 @discussion You should check `isAdValid` before trying to show the ad.
 */
@property (nonatomic, getter=isAdValid, readonly) BOOL adValid;

/*!
 @method

 @abstract
 Begins loading the FBInterstitialAd content.

 @discussion You can implement `interstitialAdDidLoad:` and `interstitialAd:didFailWithError:` methods
 of `FBInterstitialAdDelegate` if you would like to be notified as loading succeeds or fails.
 */
- (void)loadAd;

/*!
 @method

 @abstract
 Presents the interstitial ad modally from the specified view controller.

 @param rootViewController The view controller that will be used to present the interstitial ad.

 @discussion You can implement `interstitialAdDidClick:`, `interstitialAdWillClose:` and `interstitialAdWillClose`
 methods of `FBInterstitialAdDelegate` if you would like to stay informed for thoses events
 */
- (BOOL)showAdFromRootViewController:(nonnull UIViewController *)rootViewController;

@end

/*!
 @protocol

 @abstract
 The methods declared by the FBInterstitialAdDelegate protocol allow the adopting delegate to respond
 to messages from the FBInterstitialAd class and thus respond to operations such as whether the
 interstitial ad has been loaded, user has clicked or closed the interstitial.
 */
@protocol FBInterstitialAdDelegate <NSObject>

@optional

/*!
 @method

 @abstract
 Sent after an ad in the FBInterstitialAd object is clicked. The appropriate app store view or
 app browser will be launched.

 @param interstitialAd An FBInterstitialAd object sending the message.
 */
- (void)interstitialAdDidClick:(nonnull FBInterstitialAd *)interstitialAd;

/*!
 @method

 @abstract
 Sent after an FBInterstitialAd object has been dismissed from the screen, returning control
 to your application.

 @param interstitialAd An FBInterstitialAd object sending the message.
 */
- (void)interstitialAdDidClose:(nonnull FBInterstitialAd *)interstitialAd;

/*!
 @method

 @abstract
 Sent immediately before an FBInterstitialAd object will be dismissed from the screen.

 @param interstitialAd An FBInterstitialAd object sending the message.
 */
- (void)interstitialAdWillClose:(nonnull FBInterstitialAd *)interstitialAd;

/*!
 @method

 @abstract
 Sent when an FBInterstitialAd successfully loads an ad.

 @param interstitialAd An FBInterstitialAd object sending the message.
 */
- (void)interstitialAdDidLoad:(nonnull FBInterstitialAd *)interstitialAd;

/*!
 @method

 @abstract
 Sent when an FBInterstitialAd failes to load an ad.

 @param interstitialAd An FBInterstitialAd object sending the message.
 @param error An error object containing details of the error.
 */
- (void)interstitialAd:(nonnull FBInterstitialAd *)interstitialAd didFailWithError:(nonnull NSError *)error;

/*!
 @method

 @abstract
 Sent immediately before the impression of an FBInterstitialAd object will be logged.

 @param interstitialAd An FBInterstitialAd object sending the message.
 */
- (void)interstitialAdWillLogImpression:(nonnull FBInterstitialAd *)interstitialAd;

@end
