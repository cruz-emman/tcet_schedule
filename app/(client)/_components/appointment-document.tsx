import React, { useState, useEffect } from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import { Loader2 } from 'lucide-react';

// Assume these are imported correctly
import CUSTOMLOGO_1 from '@/public/sample_logo.png';
import CUSTOMLOGO2 from '@/public/logo2.png';
import { format } from 'date-fns';

// Register fonts (you'll need to provide the correct paths to your font files)


// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottom: '1 solid #000',
    paddingBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
  },
  headerText: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  main: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 3,
  },
  email: {
    fontSize: 10,
    color: '#666',
  },

  //Content Main Header Date to Webinar
  content: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },


  labelAnswerContent: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  labelAnswer: {
    fontSize: 14,
    paddingLeft: 2
  }

});

const AppointmentDocument = ({ form }: any) => {


  const event_date = form.watch('event_date')
  const formattedDate = format(event_date, 'MMMM dd yyyy');

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Loader2 className="animate-spin" />;
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={CUSTOMLOGO_1.src} style={styles.logo} />
          <View style={styles.headerText}>
            <Text style={styles.main}>Trinity University Of Asia</Text>
            <Text style={styles.subtitle}>Trinitian Center for Education and Technology</Text>
            <Text style={styles.email}>tua@edu.ph</Text>
          </View>
          <Image src={CUSTOMLOGO2.src} style={styles.logo} />
        </View>

        <View style={styles.content} >
          <View style={styles.labelAnswerContent}>
            <Text style={styles.label}>title: </Text>
            <Text style={styles.labelAnswer}>{form.watch('title')}</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
};


export default AppointmentDocument