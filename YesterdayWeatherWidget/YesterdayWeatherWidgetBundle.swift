import WidgetKit
import SwiftUI

@main
struct YesterdayWeatherWidgetBundle: WidgetBundle {
    init() {
        BrandFonts.register()
    }

    var body: some Widget {
        LockScreenCompareWidget()
        HomeScreenCompareWidget()
    }
}
