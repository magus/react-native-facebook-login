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
#import <UIKit/UIKit.h>

#import "FBAdDefines.h"
#import "FBNativeAd.h"
#import "FBNativeAdTableViewAdProvider.h"
#import "FBNativeAdView.h"
#import "FBNativeAdsManager.h"

/*!
 @class FBNativeAdTableViewCellProvider

 @abstract Class which assists in putting FBNativeAdViews into UITableViews. This class manages the creation of UITableViewCells which host native ad views. Functionality is provided to create UITableCellViews as needed for a given indexPath as well as computing the height of the cells.
 */
FB_CLASS_EXPORT
@interface FBNativeAdTableViewCellProvider : FBNativeAdTableViewAdProvider

/*!
 @method

 @abstract Method to create a FBNativeAdTableViewCellProvider.

 @param manager The naitve ad manager consumed by this provider
 @param type The type of this native ad template. For more information, consult FBNativeAdViewType.
 */
- (nonnull instancetype)initWithManager:(nonnull FBNativeAdsManager *)manager forType:(FBNativeAdViewType)type;

/*!
 @method

 @abstract Method to create a FBNativeAdTableViewCellProvider.

 @param manager The naitve ad manager consumed by this provider
 @param type The type of this native ad template. For more information, consult FBNativeAdViewType.
 @param attributes The layout of this native ad template. For more information, consult FBNativeAdViewLayout.
 */
- (nonnull instancetype)initWithManager:(nonnull FBNativeAdsManager *)manager forType:(FBNativeAdViewType)type forAttributes:(nonnull FBNativeAdViewAttributes *)attributes NS_DESIGNATED_INITIALIZER;

/*!
 @method

 @abstract Helper method for implementors of UITableViewDataSource who would like to host native ad UITableViewCells in their table view.
 */
- (nonnull UITableViewCell *)tableView:(nonnull UITableView *)tableView cellForRowAtIndexPath:(nonnull NSIndexPath *)indexPath;

/*!
 @method

 @abstract Helper method for implementors of UITableViewDelegate who would like to host native ad UITableViewCells in their table view.
 */
- (CGFloat)tableView:(nonnull UITableView *)tableView heightForRowAtIndexPath:(nonnull NSIndexPath *)indexPath;

/*!
 @method

 @abstract Helper method for implementors of UITableViewDelegate who would like to host native ad UITableViewCells in their table view.
 */
- (CGFloat)tableView:(nonnull UITableView *)tableView estimatedHeightForRowAtIndexPath:(nonnull NSIndexPath *)indexPath;

@end
