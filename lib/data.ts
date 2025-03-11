export const purposeChoice = [
  {
    id: 'class',
    label: 'Class'
  },
  {

    id: 'academic_culminating_class',
    label: 'Academic Culminating Classes'
  },
  {
    id: 'meeting',
    label: 'Meeting'
  },
  {
    id: 'students_development',
    label: 'Student Development'
  },
  {
    id: 'faculty_development',
    label: 'Faculty Development'
  },

]

export const does_have_assistance_choice = [
  {
    id: 'none',
    label: "None"
  },
  {
    id: "tcet",
    label: "TCET",
  },
  {
    id: "others",
    label: "Others",
  },
];


export const zoomMeetingChoice = [
  {
    id: 'meeting_attendees',
    label: 'Attendees can open their camera',
  },
  {
    id: 'meeting_waiting',
    label: 'Waiting Room',
  },
  {
    id: 'meeting_breakout',
    label: "Breakout Room"
  },
  {
    id: 'meeting_poll',
    label: 'Poll'
  },
  {
    id: 'meeting_recording',
    label: 'Recording'
  },
  {
    id: 'meeting_livestream',
    label: 'Livestreaming'
  },
  {
    id: 'meeting_hybrid',
    label: "Hybrid"
  },
  {
    id: 'meeting_others',
    label: 'Others'
  }
]

export const zoomWebinarChoice = [
  {
    id: 'webinar_practice',
    label: 'Practice Sessions',
  },
  {
    id: 'webinar_poll',
    label: "Poll"
  },
  {
    id: 'webinar_QandA',
    label: 'Q&A Box'
  },

  {
    id: 'webinar_reminder',
    label: 'Reminder Email',
  },
  {
    id: 'webinar_panelist',
    label: 'Panelist'
  },
  {
    id: 'webinar_livestreaming',
    label: 'Livestreaming'
  },
  {
    id: 'webinar_hybrid',
    label: "Hybrid"
  },
  {
    id: 'webinar_others',
    label: 'Others'
  }

]

export const hybridChoice = [

  {

    id: 'hybrid_photo',
    label: 'Photo'
  },
  {

    id: 'hybrid_video',
    label: 'Video / Shoot'
  },
  {
    id: 'hybrid_recording',
    label: 'Recording'
  },
  {

    id: 'hybrid_livestreaming',
    label: 'Livestreaming'
  },
  {
    id: 'hybrid_others',
    label: 'Others'
  }
]

export const photoVideoChoice = [
  {

    id: 'documentation_Photo',
    label: 'Photo'
  },
  {

    id: 'documentation_Video',
    label: 'Video / Shoot'
  },
  {
    id: 'documentation_livestreaming',
    label: 'Live streaming'
  },
  {
    id: 'documentation_others',
    label: 'Others'
  }
]
export const eventsChoice = [
  {

    id: 'events_institutional',
    label: 'Events Institutional'
  },
  {

    id: 'events_extracurricular',
    label: 'Events Extracurricular'
  },
  {
    id: 'events_livestreaming',
    label: 'Livestreaming'
  },
  {
    id: 'events_others',
    label: 'Others'
  }
]

export const trainingChoice = [
  {

    id: 'training_Zoom',
    label: 'Zoom Training'
  },
  {

    id: 'training_copyleaks',
    label: 'Copyleaks Training'
  },
  {
    id: 'training_others',
    label: 'Others'
  }
]

export const reminderChoice = [
  {
    id: 'one_hour',
    label: '1 hour before the start date and time'

  },
  {
    id: 'one_day',
    label: '1 day before the start date and time'
  },
  {
    id: 'one_week',
    label: "1 week before the start date and time"
  },



]


export const timeAM = [
  {
    id: 3,
    time: '7:00 AM'
  },
  {
    id: 4,
    time: '7:30 AM'
  },
  {
    id: 5,
    time: '8:00 AM'
  },
  {
    id: 6,
    time: '8:30 AM'
  },
  {
    id: 7,
    time: '9:00 AM'
  },
  {
    id: 8,
    time: '9:30 AM'
  },
  {
    id: 9,
    time: '10:00 AM'
  },
  {
    id: 10,
    time: '10:30 AM'
  },
  {
    id: 11,
    time: '11:00 AM'
  },
  {
    id: 12,
    time: '11:30 AM'
  },
  {
    id: 13,
    time: '12:00 PM'
  },
  {
    id: 14,
    time: '12:30 PM'
  },
];

export const timePM = [
  {
    id: 15,
    time: '1:00 PM'
  },
  {
    id: 16,
    time: '1:30 PM'
  },
  {
    id: 17,
    time: '2:00 PM'
  },
  {
    id: 18,
    time: '2:30 PM'
  },
  {
    id: 19,
    time: '3:00 PM'
  },
  {
    id: 20,
    time: '3:30 PM'
  },
  {
    id: 21,
    time: '4:00 PM'
  },
  {
    id: 22,
    time: '4:30 PM'
  },
  {
    id: 23,
    time: '5:00 PM'
  },
];



//ADMIN SIDE

export const NavbarLinks = [
  { label: "Appointment", link: "/" },
  { label: "Dashboard", link: "/dashboard" },
  { label: "Result", link: "/results" },
  { label: "Overview Reports", link: '/reports' }
];

export const StatusOption = [
  {
    value: "pending",
    badgeColor: 'bg-yellow-500',
    label: "Pending",

  },
  {
    value: "approved",
    badgeColor: 'bg-green-500',
    label: "Approved",

  },
]

export const ResultOption = [
  {
    value: "done",
    label: "Done",
    badgeColor: 'bg-blue-500',

  },
  {
    value: "cancel",
    label: "Cancel",
    badgeColor: 'bg-red-500',
  },
]

export const MeetingTypeOption = [
  { label: "Meeting", value: "meeting", badgeColor: 'bg-indigo-500' },
  { label: "Webinar", value: "webinar", badgeColor: 'bg-fuchsia-500' },
  { label: "Hybrid", value: "hybrid", badgeColor: 'bg-red-500' },
  { label: "Documentation", value: "documentation", badgeColor: 'bg-orange-500' },
  { label: "Training", value: "training", badgeColor: 'bg-emerald-500' },
  { label: 'Events', value: "events", badgeColor: 'bg-rose-500' }
]

export const departmentOptions = [

  { label: 'Accounting - Finance and Accounting Office', value: "ACCOUNTING"},
  { label: 'AIRGEO - (Alumni, Industry Relations, and Global Education Office)', value: "AIRGEO" },
  { label: "BAMO - Building Administrator & Maintenance Office", value: "BAMO"},
  { label: 'CAHS - (College of Allied Health Sciences)', value: "CAHS" },
  { label: 'CASE - (College of Arts, Sciences, and Education)', value: "CASE" },
  { label: 'CBMA - (College of Business, Management & Accountancy)', value: "CBMA" },
  { label: 'CEIS - (College of Engineering and Information Sciences)', value: "CEIS" },
  { label: 'CHAPLAIN', value: "CHAPLAIN" },
  { label: 'CMT - (College of Medical Technology)', value: "CMT" },
  { label: "GSO(Purchasing) - General Services Office (Purchasing)", value: "GSO(Purchasing)"},
  { label: "HRMO - Human Resources Management Office", value: "HRMO"},
  {label: "ICTO - Information and Communications Technology Office / Data Protection Office", value: "ICTO"},
  { label: "MDO - Medical and Dental Office", value: "MDO" },
  { label: "MIO - Management Information Office", value: "MIO"},
  { label: "OAR - Office of Admission and Registration", value: "OAR"},
  { label: "OP - Office of the President", value: "OP"},
  { label: "OVF - Office of Vice President for Administrator and Finance", value: "OVF"},
  { label: "OVPAA - Office of the Vice President for Academic Affairs", value: "OVPAA"},
  { label: "OVP SPLL -Office of  Vice President for Sustainable Partnerships and Lifelong Learning", value: "OVP-SPLL"},
  { label: "PRPO(DMU) - PPRO - Digital Marketing Unit", value: "PRPO (DMU)"},
  { label: "PRPO(EMU) - PPRO Engagement Marketing Unit", value: "PRPO (EMU)"},
  { label: "QASMO - Quality Assurance and Strategic Management Office", value: "QASMO"},
  { label: "SAC - Student Affair's Center", value: "SAC"},
  { label: "SLCN - St. Luke's College of Nursing", value: "SLCN"},
  { label: "TCET - Trinitian Center for Education and Technology", value: "TCET"},
  { label: "TCCD - Trinitian Center for Community Development", value: "TCCD"},
  { label: "TGCC - Trinitian Guidance and Career Center", value: "TGCC"},
  { label: "TOUA - Trinity Open University of Asia", value: "TOUA"},
  { label: "TUA IBAM - Institute of Business and Management", value: "TUA-IBAM"},
  { label: "TUA LIBRARY - Trinity University of Asia Library", value: "TUA-LIBRARY"},
  { label: "URDC - University Research and Development Center", value: "URDC"}

]


export const assistedBy = [
  { id: "alyanna", label: "Alyanna" },
  { id: "emman", label: "Emman" },
  { id: "laciste", label: "Laciste" },
  { id: "kyle", label: "Kyle" },
  { id: "juvi", label: "Juvi" },
] as const