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

#ifndef FBAudienceNetwork_FBAdDefines_h
#define FBAudienceNetwork_FBAdDefines_h

#ifdef __cplusplus
#define FB_EXTERN_C_BEGIN  extern "C" {
#define FB_EXTERN_C_END  }
#else
#define FB_EXTERN_C_BEGIN
#define FB_EXTERN_C_END
#endif

#ifdef __cplusplus
# define FB_EXPORT extern "C" __attribute__((visibility("default")))
#else
# define FB_EXPORT extern __attribute__((visibility("default")))
#endif

#define FB_CLASS_EXPORT __attribute__((visibility("default")))
#define FB_DEPRECATED __attribute__((deprecated))

#if __IPHONE_9_0
#define FBInterfaceOrientationMask UIInterfaceOrientationMask
#else
#define FBInterfaceOrientationMask NSUInteger
#endif

#endif
