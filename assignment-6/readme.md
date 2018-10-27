# Assignment 6

## Part One: Write and execute a query for your AA data PostgreSQL

**Get the count of all the meetings**

```sql
SELECT count(*) FROM meetings;
```

**Get all the meetings with the address info included**

```sql
SELECT * FROM meetings LEFT JOIN locations ON meetings.location_id = locations.id;
```

**Get meeting titles and lat longs**

```sql
SELECT meetings.title, locations.latitude, locations.longitude FROM meetings LEFT JOIN locations ON meetings.location_id = locations.id;
```

**Get the meeting titles for meetings that start after 9am**

```sql
SELECT meetings.title, meeting_hours.day FROM meeting_hours LEFT JOIN meetings ON meeting_hours.meeting_id = meetings.id WHERE meeting_hours.start_time >= '09:00';
```

## Part Two: Write and execute a query for your Dear Diary data DynamoDB
