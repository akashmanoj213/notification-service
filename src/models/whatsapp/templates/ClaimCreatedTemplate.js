class ClaimCreatedTemplate {
  constructor(claimObj) {
    const {
      claimId,
      claimType,
      patientFullName,
      caretakerContactNumber,
      totalClaimAmount,
    } = claimObj;

    this.name = 'customer_claim_raised';
    this.language = {
      code: 'en_US',
    };

    this.components = [
      {
        type: 'header',
        parameters: [
          {
            type: 'text',
            text: claimId,
          },
        ],
      },
      {
        type: 'body',
        parameters: [
          {
            type: 'text',
            text: claimId,
          },
          {
            type: 'text',
            text: claimType,
          },
          {
            type: 'text',
            text: patientFullName,
          },
          {
            type: 'text',
            text: caretakerContactNumber,
          },
          {
            type: 'text',
            text: totalClaimAmount,
          },
          {
            type: 'text',
            text: `https://pruinhlth-nprd-dev-scxlyx-7250.el.r.appspot.com/claim#/pasclaim?claimId=${claimId}`,
          },
        ],
      },
    ];
  }
}

module.exports = ClaimCreatedTemplate;
