import WidgetKit
import SwiftUI

@main
struct YesterdayWeatherWidgetBundle: WidgetBundle {
    var body: some Widget {
        LockScreenCompareWidget()
        HomeScreenCompareWidget()
    }
}
