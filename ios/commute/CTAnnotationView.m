//
//  CTAnnotationView.m
//  commute
//
//  Created by Alexis Kinsella on 04/08/2016.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "CTAnnotationView.h"
#import "RCTConvert.h"

@implementation CTAnnotationView

- (void)drawRect:(CGRect)rect {
  
  NSLog(@"Number: %@, use Small Pin: %d", self.number, self.useSmallPin);
  
  [super drawRect:rect];
  
  CGColorRef strokeColor = [RCTConvert CGColor: self.strokeColor];
  CGColorRef backgroundColor = [RCTConvert CGColor: self.bgColor];
  
  CGFloat lineWidth = self.lineWidth;
  CGRect borderRect = CGRectMake(0, 0, self.frame.size.width, self.frame.size.height);
  borderRect = CGRectInset(borderRect, lineWidth * 0.5, lineWidth * 0.5);
  CGContextRef context = UIGraphicsGetCurrentContext();
  
  
  if (!self.useSmallPin) {
    CGContextSetStrokeColorWithColor(context, strokeColor);
    CGContextSetLineWidth(context, self.lineWidth);
    CGContextStrokeEllipseInRect(context, borderRect);
  }
  
  CGContextSetFillColorWithColor(context, self.useSmallPin ? strokeColor : backgroundColor);
  CGContextFillEllipseInRect (context, borderRect);
  CGContextFillPath(context);


  if (!self.useSmallPin) {
    NSString *string = [NSString stringWithFormat:@"%@", self.value];
    
    NSMutableParagraphStyle* style = [[NSMutableParagraphStyle alloc] init];
    [style setAlignment:NSTextAlignmentCenter];
    
    UIFont * font = [RCTConvert UIFont: [UIFont fontWithName:@"System" size: self.fontSize] withWeight: self.fontWeight];
    
    NSDictionary *textAttributes = @{
                                     NSFontAttributeName: font,
                                     NSForegroundColorAttributeName: self.useSmallPin ? [UIColor whiteColor] : [RCTConvert UIColor: self.strokeColor],
                                     NSParagraphStyleAttributeName: style
                                     };
    
    CGRect newFrame = self.frame;
    newFrame.origin.y = (self.frame.size.height - font.lineHeight) / 2;
    
    [string drawInRect: newFrame withAttributes:textAttributes];
  }
}

@end
