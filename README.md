# Detox Tree

Android detox widget prototype for showing a growing tree, streak rewards, and a collectible forest.

## Concept

The widget shows:

- A tree illustration with 5 gradual states.
- A short status sentence for the current day.
- Today's focus or phone-free time.
- A streak badge and resource badges.
- Hidden bonus visuals when the user exceeds the goal.
- Real flowering-tree photos and short learning cards in the collection.

The current Expo app previews the widget UI and simulates usage levels. The real Android home
screen widget requires native Android code.

## Run the preview

```bash
npm install
npx expo start -c --tunnel
```

## Tree stages

1. Seed: 0 to 10 minutes.
2. Sprout: 10 to 30 minutes.
3. Sapling: 30 to 50 minutes.
4. Mature tree: 50 minutes to goal completion.
5. Bonus: goal exceeded without checking the phone.

## Collection system

The Forest tab previews a collectible "my forest" index:

- Normal success grants common trees like oak.
- Long focus sessions unlock rare trees like cherry blossom.
- Extra-long detox sessions can unlock epic or legendary trees.
- Water drops and sunlight points can be spent on pots or background themes.
- Streak badges stay visible in the widget corner to encourage daily success.
- Each collected tree can show a real photo, scientific name, bloom season, and a short fact.

## Android widget implementation path

Expo Go cannot display Android home screen widgets. Build the real widget after creating an Android
native project:

```bash
npx expo prebuild --platform android
npx expo run:android
```

Native Android pieces to add:

- `AppWidgetProvider` for the home screen widget.
- `RemoteViews` layout for the tree, text, and progress state.
- `UsageStatsManager` for app usage data after the user enables Usage Access.
- `WorkManager` or `AlarmManager` for periodic widget refresh.
- Shared storage for passing computed stage data from the app to the widget.

The app already declares `android.permission.PACKAGE_USAGE_STATS` and includes a button that opens
Android Usage Access settings.
