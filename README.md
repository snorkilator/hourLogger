# TODO
consider rewriting
untangle state chain

# hourLogger
A website to log hours for Be and Become 

Plan:
https://docs.google.com/document/d/17ZTmqbgjQvEiUvInNafnsx-ZJ6mdyEt6CXAev-KahBc/edit

# new Plan (lazy)
do all dataselection on client, including extracting summaries for homepage
store entire day as json blob
send entire json blob on:
    reqular time intervols
    when save button
    on add row in table

do send every certain amount of changes eventually
find out how to send diffs eventually

when date changes of day form
    check if already exists:
     exists:
        send are you sure message than continue
        else continue
    create new row with new date
            success:
                delete old row
                    success:
                    failure:
                        show alert
            failure:
                show alert
                set to 

# old plan
## database datastruct:
user:
    days:
        activity table:
            hrs: string
            activity: string
            ID primary key: number
        goals: string
            

## server datastructures:
represent date for page in time.date format
store page table in slice of structs
    struct has:
        hrs: int
        activity: string
goals as string

## client datastructure:
table of activities:
    hrs: number
    activities: string
Goals: string
