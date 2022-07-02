# hourLogger
A website to log hours for Be and Become 

Plan:
https://docs.google.com/document/d/17ZTmqbgjQvEiUvInNafnsx-ZJ6mdyEt6CXAev-KahBc/edit

# 
Blueprint

## database datastruct:
user:
    days:
        activity table:
            hrs: string
            activity: string
            ID primary key: number
        summary: string
        goals: string
            

## server datastructures:
represent date for page in time.date format
store page table in slice of structs
    struct has: hrs, activity
goals as string

## client datastructure:
