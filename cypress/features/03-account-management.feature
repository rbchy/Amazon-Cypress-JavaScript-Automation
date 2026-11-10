Feature: Post-Purchase & Account Management
  As an Amazon customer
  I want to manage my orders, returns, and account settings
  So that I can effectively manage my purchases

  Background:
    Given I am on Amazon home page
    And I am logged in as "testuser@gmail.com"

  Scenario: TC-008 - Initiate product return
    Given I have a completed purchase order "#123456"
    When I go to Account & Lists
    And I click on Returns & Orders
    And I select order "#123456"
    Then I should see order details
    When I click Return Items button
    And I select item "Dell Laptop" to return
    And I select return reason "Defective"
    And I select return method "UPS pickup"
    And I click Submit Return Request
    Then I should see "Return initiated successfully"
    And I should receive return label
    And Return status should show "Pending"

  Scenario: TC-008 - Track return status
    Given I have initiated a return
    When I go to Returns & Orders
    And I click on my active return
    Then I should see return status "In Progress"
    And I should see return tracking number
    And I should see expected refund date
    When I click on tracking number
    Then return tracking should open in new window

  Scenario: TC-008 - Return for wrong item
    Given I have received wrong item in order
    When I go to Returns & Orders
    And I select the order
    And I click Return Items
    And I select wrong item
    And I select reason "Wrong item sent"
    And I proceed with return
    Then Return should be processed as replacement
    And I should see replacement shipping options

  Scenario: TC-009 - Subscribe to Amazon Prime
    When I click on Prime menu
    And I click Join Prime button
    Then I should see Prime benefits page
    When I select membership type "Annual ($139.99/year)"
    And I click Subscribe Now
    And I review and accept terms
    And I confirm payment
    Then Prime membership should be activated
    And I should see "Welcome to Prime" message
    And Free shipping should be enabled on all orders

  Scenario: TC-009 - Prime membership features
    Given I have active Prime membership
    When I go to My Prime
    Then I should see all Prime benefits:
      | Benefit |
      | Free 2-Day Shipping |
      | Prime Video |
      | Prime Music |
      | Prime Reading |
      | Prime Photos |

  Scenario: TC-009 - Cancel Prime membership
    Given I have active Prime membership
    When I go to Prime Settings
    And I click Cancel Membership
    And I select cancel reason
    And I confirm cancellation
    Then Membership should be cancelled
    And I should see "Membership will expire on [date]"
    And Free shipping benefits should be removed

  Scenario: TC-010 - View browsing history
    Given I have browsed several products
    When I go to Account & Lists
    And I click on Browsing History
    Then I should see all browsed products
    And Products should be listed with most recent first
    When I click on any product
    Then product details page should open
    When I click Clear Browsing History
    Then all history should be deleted
    And Browsing history should be empty

  Scenario: TC-010 - Filter browsing history by date
    Given I have browsing history
    When I go to Browsing History
    And I select date filter "Last 30 days"
    Then only products from last 30 days should be shown
    When I select "Last 90 days"
    Then products from 90 days should be shown

  Scenario: TC-011 - View purchase history
    Given I have completed multiple purchases
    When I go to Account & Lists
    And I click on Returns & Orders
    Then I should see all purchase orders
    And Each order should show:
      | Information |
      | Order Number |
      | Order Date |
      | Total Price |
      | Items |
      | Delivery Status |

  Scenario: TC-011 - Filter orders by date range
    Given I have purchase history spanning multiple years
    When I go to Returns & Orders
    And I select "Last 6 months" filter
    Then only orders from last 6 months should be shown
    When I click on an order
    Then detailed order information should be displayed
    And I should see invoice option
    And I should see reorder option

  Scenario: TC-011 - Download invoice
    Given I have completed purchases
    When I go to Returns & Orders
    And I click on an order
    And I click Download Invoice button
    Then invoice PDF should be downloaded
    And PDF should contain:
      | Content |
      | Order Number |
      | Items with prices |
      | Shipping address |
      | Billing address |
      | Total amount |

  Scenario: TC-012 - View Amazon Visa card benefits
    When I go to Amazon Rewards
    And I click on Amazon Visa Card
    Then I should see card benefits page
    And I should see:
      | Benefit |
      | Cashback rate |
      | Annual fee information |
      | Sign-up bonus |
      | Benefits summary |

  Scenario: TC-012 - Apply for Amazon Visa card
    When I go to Amazon Rewards
    And I click on Amazon Visa Card
    And I click Apply Now button
    Then I should see application form
    When I enter personal information:
      | Field | Value |
      | Name | John Doe |
      | Email | john@gmail.com |
      | SSN | ****1234 |
    And I review and accept terms
    And I submit application
    Then I should see "Application Submitted"
    And I should receive confirmation email

  Scenario: TC-012 - Manage Amazon card account
    Given I have approved Amazon Visa card
    When I go to Card Management
    Then I should see:
      | Option |
      | View card details |
      | Set credit limit |
      | View rewards balance |
      | Manage payment method |

  Scenario: TC-013 - Enroll in Amazon Associates program
    When I go to Amazon Associates
    And I click Join Associates button
    Then I should see registration form
    When I enter website/channel information:
      | Field | Value |
      | Website URL | myblog.com |
      | Traffic | 1000+ monthly |
      | Content Type | Technology blog |
    And I select use case "Product reviews"
    And I review Associates agreement
    And I submit application
    Then I should see "Application Submitted"
    And I should receive affiliate account setup instructions

  Scenario: TC-013 - Generate affiliate links
    Given I have approved Associates account
    When I go to Associates Dashboard
    And I search for product "Dell Laptop"
    And I click Get Link button
    Then affiliate link should be generated
    And I should see:
      | Element |
      | Product affiliate URL |
      | QR code |
      | HTML code |
      | Copy to clipboard option |
    When I copy affiliate link
    And I share link
    Then shared link should earn commission on clicks
