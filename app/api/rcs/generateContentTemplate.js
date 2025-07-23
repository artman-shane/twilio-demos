
  /**
   * Create a content template for SMS
   * @param {*} context
   * @param {*} msgDetails
   * @param {*} activities
   * @returns
   */
  async function createCarousel(activities) {
    console.log("Creating content template");

    const promisedCards = [];
    activities.forEach((activity, index) => {
      promisedCards.push(createCard(activity, index));
    });

    const results = await Promise.allSettled(promisedCards);

    const cards = results
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value);

    const smsFallbackBody =
      `${activities[0]?.fields["Activity"]} - ${activities[0].fields["Description"]}` ||
      "Upcoming Activity. Please reach out to the presidency for more details.";

    return {
      friendly_name: "dynamic_carousel",
      language: "en",
      types: {
        "twilio/carousel": {
          body: smsFallbackBody,
          cards,
        },
        "twilio/text": {
          body:
            smsFallbackBody ||
            "Fort Yargo Ward Elders Quorum Activit Coming up. Don't miss it!",
        },
      },
    };
  }

  async function createCard(activity, i) {
    const fields = activity.fields;
    const id = activity.id;

    try {
      // If the SMS Heading + SMS Body are > 160 Characters, then we will use the LLM to generate a New title and Body
      if (
        fields["Activity"]?.length > 160 ||
        fields["Description"]?.length > 160
      ) {
        console.log(
          `Cannot have a actviity or description longer than 160 characters. Reducing length...` +
            `\nActivity: ${fields["Activity"]}\nDescription: ${fields["Description"]}`
        );
        const smsFallbackBody = {
          title: fields["Activity"].substring(0, 160),
          body: fields["Description"].substring(0, 160),
        };
        fields["Activity"] = smsFallbackBody.title;
        fields["Description"] = smsFallbackBody.body;
        console.log(
          `Reduced to: ${fields["Activity"]} - ${fields["Description"]}`
        );
      }

      return {
        title:
          `${fields["Activity"]} - ${fields["Description"]}` ||
          "Details Coming Soon",
        body: "",
        media: fields["media_for_rcs"], // `https://${fields["Media URL"]}` ||
        actions: [
          {
            type: "QUICK_REPLY",
            title: fields["SMS CTA Button 1 Text"],
            id: `yes-${activity.id}`,
          },
          {
            type: "QUICK_REPLY",
            title: fields["SMS CTA Button 2 Text"],
            id: `no-${activity.id}`,
          },
        ],
      };
    } catch (error) {
      console.error("Error creating card", error);
      console.log("Skipping this one");
      throw new Error(
        `Error creating card for activity ${id}: ${error.message}`
      );
    }
  }

// const demoActivities = [
//   {
//     id: "1",
//     fields: {
//       Activity: "RCS Messaging Webinar",
//       Description: "Join our live webinar to discover how RCS can boost your customer engagement and drive conversions.",
//       media_for_rcs: "https://example.com/images/rcs-webinar.jpg",
//       "SMS CTA Button 1 Text": "Register Now",
//       "SMS CTA Button 2 Text": "Learn More",
//     },
//   },
//   {
//     id: "2",
//     fields: {
//       Activity: "Free RCS Consultation",
//       Description: "Book a free consultation with a Twilio expert to see how RCS fits your business needs.",
//       media_for_rcs: "https://example.com/images/consultation.jpg",
//       "SMS CTA Button 1 Text": "Book Now",
//       "SMS CTA Button 2 Text": "Contact Sales",
//     },
//   },
//   {
//     id: "3",
//     fields: {
//       Activity: "RCS Success Stories",
//       Description: "Read how leading brands use Twilio RCS to deliver rich, interactive messaging experiences.",
//       media_for_rcs: "https://example.com/images/success-stories.jpg",
//       "SMS CTA Button 1 Text": "View Stories",
//       "SMS CTA Button 2 Text": "Get Started",
//     },
//   },
// ];

module.exports = {
  createCarousel,
  createCard,
};
