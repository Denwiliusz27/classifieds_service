import React, {ChangeEvent} from "react";
import {Calendar, CalendarProps, dateFnsLocalizer, EventProps, Views} from "react-big-calendar";
import {VisitCalendar} from "../models/Visit";
import {pl} from "date-fns/locale";
import {format} from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";

const locales = {
    'pl': pl,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

interface MyCalendarProps {
    events: VisitCalendar[];
    handleSelectSlot: (slotInfo: any) => void;
    style: React.CSSProperties;
    eventBackgroundAdjustment: (event: VisitCalendar) => React.CSSProperties;
    selectable: boolean;
    EventComponent: React.FC<EventProps<VisitCalendar>>;
    onSelectEvent: (event: VisitCalendar) => void;
    timeOffSlotAdjustment: (slotInfo: any) => React.HTMLAttributes<HTMLDivElement>;
}

const CalendarForVisits: React.FC<MyCalendarProps> = ({
    events,
    handleSelectSlot,
    style,
    eventBackgroundAdjustment,
    selectable,
    EventComponent,
    onSelectEvent,
    timeOffSlotAdjustment
}) => {
    // Function to get event props
    const eventPropGetter: CalendarProps<VisitCalendar>['eventPropGetter'] = (event) => {
        return { style: eventBackgroundAdjustment(event) };
    };

    return (
        <Calendar
            culture="pl"
            localizer={localizer}
            events={events}
            defaultView={Views.WEEK}
            step={15}
            views={[Views.WEEK]}
            min={new Date(0, 0, 0, 6, 0, 0)}
            max={new Date(0, 0, 0, 22, 0, 0)}
            onSelectSlot={handleSelectSlot}
            startAccessor={(event: VisitCalendar) => event.info.start_date}
            endAccessor={(event: VisitCalendar) => event.info.end_date}
            style={style}
            messages={{
                previous: 'Poprzedni',
                next: 'Następny',
                today: 'Dziś',
            }}
            eventPropGetter={eventPropGetter}
            selectable={selectable}
            components={{
                event: EventComponent,
            }}
            onSelectEvent={onSelectEvent}
            slotPropGetter={timeOffSlotAdjustment}
        />
    );
};

export default CalendarForVisits;
