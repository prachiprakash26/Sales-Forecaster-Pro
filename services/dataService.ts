import * as d3 from 'd3-dsv';
import { SalesRecord } from '../types';

// Data reflects Orange Juice sales in the Indian market, with clear seasonality (higher sales in summer).
const CSV_DATA = `Date,Store,Product,Sales
2021-01-04,North India,Classic Orange,1510
2021-01-11,North India,Classic Orange,1530
2021-01-18,North India,Classic Orange,1525
2021-01-25,North India,Classic Orange,1540
2021-02-01,North India,Classic Orange,1600
2021-02-08,North India,Classic Orange,1620
2021-02-15,North India,Classic Orange,1650
2021-02-22,North India,Classic Orange,1700
2021-03-01,North India,Classic Orange,2000
2021-03-08,North India,Classic Orange,2150
2021-03-15,North India,Classic Orange,2300
2021-03-22,North India,Classic Orange,2450
2021-03-29,North India,Classic Orange,2800
2021-04-05,North India,Classic Orange,3200
2021-04-12,North India,Classic Orange,3500
2021-04-19,North India,Classic Orange,3800
2021-04-26,North India,Classic Orange,4100
2021-05-03,North India,Classic Orange,4500
2021-05-10,North India,Classic Orange,4800
2021-05-17,North India,Classic Orange,4750
2021-05-24,North India,Classic Orange,4600
2021-05-31,North India,Classic Orange,4400
2021-06-07,North India,Classic Orange,4200
2021-06-14,North India,Classic Orange,4000
2021-06-21,North India,Classic Orange,3800
2021-06-28,North India,Classic Orange,3600
2021-07-05,North India,Classic Orange,3300
2021-07-12,North India,Classic Orange,3100
2021-07-19,North India,Classic Orange,2900
2021-07-26,North India,Classic Orange,2700
2021-08-02,North India,Classic Orange,2500
2021-08-09,North India,Classic Orange,2400
2021-08-16,North India,Classic Orange,2300
2021-08-23,North India,Classic Orange,2200
2021-08-30,North India,Classic Orange,2100
2021-09-06,North India,Classic Orange,2000
2021-09-13,North India,Classic Orange,1950
2021-09-20,North India,Classic Orange,1900
2021-09-27,North India,Classic Orange,1850
2021-10-04,North India,Classic Orange,1800
2021-10-11,North India,Classic Orange,1850
2021-10-18,North India,Classic Orange,1900
2021-10-25,North India,Classic Orange,1950
2021-11-01,North India,Classic Orange,1700
2021-11-08,North India,Classic Orange,1650
2021-11-15,North India,Classic Orange,1600
2021-11-22,North India,Classic Orange,1620
2021-11-29,North India,Classic Orange,1680
2021-12-06,North India,Classic Orange,1700
2021-12-13,North India,Classic Orange,1750
2021-12-20,North India,Classic Orange,1800
2021-12-27,North India,Classic Orange,1780
2022-01-03,North India,Classic Orange,1600
2022-01-10,North India,Classic Orange,1620
2022-01-17,North India,Classic Orange,1610
2022-01-24,North India,Classic Orange,1630
2022-01-31,North India,Classic Orange,1700
2022-02-07,North India,Classic Orange,1720
2022-02-14,North India,Classic Orange,1750
2022-02-21,North India,Classic Orange,1800
2022-02-28,North India,Classic Orange,2200
2022-03-07,North India,Classic Orange,2350
2022-03-14,North India,Classic Orange,2500
2022-03-21,North India,Classic Orange,2650
2022-03-28,North India,Classic Orange,3000
2022-04-04,North India,Classic Orange,3400
2022-04-11,North India,Classic Orange,3700
2022-04-18,North India,Classic Orange,4000
2022-04-25,North India,Classic Orange,4300
2022-05-02,North India,Classic Orange,4700
2022-05-09,North India,Classic Orange,5000
2022-05-16,North India,Classic Orange,4950
2022-05-23,North India,Classic Orange,4800
2022-05-30,North India,Classic Orange,4600
2022-06-06,North India,Classic Orange,4400
2022-06-13,North India,Classic Orange,4200
2022-06-20,North India,Classic Orange,4000
2022-06-27,North India,Classic Orange,3800
2022-07-04,North India,Classic Orange,3500
2022-07-11,North India,Classic Orange,3300
2022-07-18,North India,Classic Orange,3100
2022-07-25,North India,Classic Orange,2900
2022-08-01,North India,Classic Orange,2700
2022-08-08,North India,Classic Orange,2600
2022-08-15,North India,Classic Orange,2500
2022-08-22,North India,Classic Orange,2400
2022-08-29,North India,Classic Orange,2300
2022-09-05,North India,Classic Orange,2200
2022-09-12,North India,Classic Orange,2150
2022-09-19,North India,Classic Orange,2100
2022-09-26,North India,Classic Orange,2050
2022-10-03,North India,Classic Orange,2000
2022-10-10,North India,Classic Orange,2050
2022-10-17,North India,Classic Orange,2100
2022-10-24,North India,Classic Orange,2150
2022-10-31,North India,Classic Orange,1900
2022-11-07,North India,Classic Orange,1850
2022-11-14,North India,Classic Orange,1800
2022-11-21,North India,Classic Orange,1820
2022-11-28,North India,Classic Orange,1880
2022-12-05,North India,Classic Orange,1900
2022-12-12,North India,Classic Orange,1950
2022-12-19,North India,Classic Orange,2000
2022-12-26,North India,Classic Orange,1980
2023-01-02,North India,Classic Orange,1800
2023-01-09,North India,Classic Orange,1820
2023-01-16,North India,Classic Orange,1810
2023-01-23,North India,Classic Orange,1830
2023-01-30,North India,Classic Orange,1900
2023-02-06,North India,Classic Orange,1920
2023-02-13,North India,Classic Orange,1950
2023-02-20,North India,Classic Orange,2000
2023-02-27,North India,Classic Orange,2400
2023-03-06,North India,Classic Orange,2550
2023-03-13,North India,Classic Orange,2700
2023-03-20,North India,Classic Orange,2850
2023-03-27,North India,Classic Orange,3200
2023-04-03,North India,Classic Orange,3600
2023-04-10,North India,Classic Orange,3900
2023-04-17,North India,Classic Orange,4200
2023-04-24,North India,Classic Orange,4500
2023-05-01,North India,Classic Orange,4900
2023-05-08,North India,Classic Orange,5200
2023-05-15,North India,Classic Orange,5150
2023-05-22,North India,Classic Orange,5000
2023-05-29,North India,Classic Orange,4800
2023-06-05,North India,Classic Orange,4600
2023-06-12,North India,Classic Orange,4400
2023-06-19,North India,Classic Orange,4200
2023-06-26,North India,Classic Orange,4000
2023-07-03,North India,Classic Orange,3700
2023-07-10,North India,Classic Orange,3500
2023-07-17,North India,Classic Orange,3300
2023-07-24,North India,Classic Orange,3100
2023-07-31,North India,Classic Orange,2900
2023-08-07,North India,Classic Orange,2800
2023-08-14,North India,Classic Orange,2700
2023-08-21,North India,Classic Orange,2600
2023-08-28,North India,Classic Orange,2500
2023-09-04,North India,Classic Orange,2400
2023-09-11,North India,Classic Orange,2350
2023-09-18,North India,Classic Orange,2300
2023-09-25,North India,Classic Orange,2250
2023-10-02,North India,Classic Orange,2200
2023-10-09,North India,Classic Orange,2250
2023-10-16,North India,Classic Orange,2300
2023-10-23,North India,Classic Orange,2350
2023-10-30,North India,Classic Orange,2100
2023-11-06,North India,Classic Orange,2050
2023-11-13,North India,Classic Orange,2000
2023-11-20,North India,Classic Orange,2020
2023-11-27,North India,Classic Orange,2080
2023-12-04,North India,Classic Orange,2100
2023-12-11,North India,Classic Orange,2150
2023-12-18,North India,Classic Orange,2200
2023-12-25,North India,Classic Orange,2180
2021-01-04,South India,Pulp-Free,2210
2021-01-11,South India,Pulp-Free,2240
2021-01-18,South India,Pulp-Free,2230
2021-01-25,South India,Pulp-Free,2260
2021-02-01,South India,Pulp-Free,2300
2021-02-08,South India,Pulp-Free,2350
2021-02-15,South India,Pulp-Free,2400
2021-02-22,South India,Pulp-Free,2500
2021-03-01,South India,Pulp-Free,2800
2021-03-08,South India,Pulp-Free,2900
2021-03-15,South India,Pulp-Free,3000
2021-03-22,South India,Pulp-Free,3100
2021-03-29,South India,Pulp-Free,3300
2021-04-05,South India,Pulp-Free,3500
2021-04-12,South India,Pulp-Free,3600
2021-04-19,South India,Pulp-Free,3700
2021-04-26,South India,Pulp-Free,3800
2021-05-03,South India,Pulp-Free,4000
2021-05-10,South India,Pulp-Free,4100
2021-05-17,South India,Pulp-Free,4050
2021-05-24,South India,Pulp-Free,4000
2021-05-31,South India,Pulp-Free,3900
2021-06-07,South India,Pulp-Free,3800
2021-06-14,South India,Pulp-Free,3700
2021-06-21,South India,Pulp-Free,3600
2021-06-28,South India,Pulp-Free,3500
2021-07-05,South India,Pulp-Free,3400
2021-07-12,South India,Pulp-Free,3300
2021-07-19,South India,Pulp-Free,3200
2021-07-26,South India,Pulp-Free,3100
2021-08-02,South India,Pulp-Free,3000
2021-08-09,South India,Pulp-Free,2950
2021-08-16,South India,Pulp-Free,2900
2021-08-23,South India,Pulp-Free,2850
2021-08-30,South India,Pulp-Free,2800
2021-09-06,South India,Pulp-Free,2750
2021-09-13,South India,Pulp-Free,2700
2021-09-20,South India,Pulp-Free,2650
2021-09-27,South India,Pulp-Free,2600
2021-10-04,South India,Pulp-Free,2550
2021-10-11,South India,Pulp-Free,2580
2021-10-18,South India,Pulp-Free,2600
2021-10-25,South India,Pulp-Free,2620
2021-11-01,South India,Pulp-Free,2400
2021-11-08,South India,Pulp-Free,2380
2021-11-15,South India,Pulp-Free,2350
2021-11-22,South India,Pulp-Free,2360
2021-11-29,South India,Pulp-Free,2390
2021-12-06,South India,Pulp-Free,2400
2021-12-13,South India,Pulp-Free,2420
2021-12-20,South India,Pulp-Free,2450
2021-12-27,South India,Pulp-Free,2430
2022-01-03,South India,Pulp-Free,2300
2022-01-10,South India,Pulp-Free,2320
2022-01-17,South India,Pulp-Free,2310
2022-01-24,South India,Pulp-Free,2330
2022-01-31,South India,Pulp-Free,2400
2022-02-07,South India,Pulp-Free,2450
2022-02-14,South India,Pulp-Free,2500
2022-02-21,South India,Pulp-Free,2600
2022-02-28,South India,Pulp-Free,2900
2022-03-07,South India,Pulp-Free,3000
2022-03-14,South India,Pulp-Free,3100
2022-03-21,South India,Pulp-Free,3200
2022-03-28,South India,Pulp-Free,3400
2022-04-04,South India,Pulp-Free,3600
2022-04-11,South India,Pulp-Free,3700
2022-04-18,South India,Pulp-Free,3800
2022-04-25,South India,Pulp-Free,3900
2022-05-02,South India,Pulp-Free,4100
2022-05-09,South India,Pulp-Free,4200
2022-05-16,South India,Pulp-Free,4150
2022-05-23,South India,Pulp-Free,4100
2022-05-30,South India,Pulp-Free,4000
2022-06-06,South India,Pulp-Free,3900
2022-06-13,South India,Pulp-Free,3800
2022-06-20,South India,Pulp-Free,3700
2022-06-27,South India,Pulp-Free,3600
2022-07-04,South India,Pulp-Free,3500
2022-07-11,South India,Pulp-Free,3400
2022-07-18,South India,Pulp-Free,3300
2022-07-25,South India,Pulp-Free,3200
2022-08-01,South India,Pulp-Free,3100
2022-08-08,South India,Pulp-Free,3050
2022-08-15,South India,Pulp-Free,3000
2022-08-22,South India,Pulp-Free,2950
2022-08-29,South India,Pulp-Free,2900
2022-09-05,South India,Pulp-Free,2850
2022-09-12,South India,Pulp-Free,2800
2022-09-19,South India,Pulp-Free,2750
2022-09-26,South India,Pulp-Free,2700
2022-10-03,South India,Pulp-Free,2650
2022-10-10,South India,Pulp-Free,2680
2022-10-17,South India,Pulp-Free,2700
2022-10-24,South India,Pulp-Free,2720
2022-10-31,South India,Pulp-Free,2500
2022-11-07,South India,Pulp-Free,2480
2022-11-14,South India,Pulp-Free,2450
2022-11-21,South India,Pulp-Free,2460
2022-11-28,South India,Pulp-Free,2490
2022-12-05,South India,Pulp-Free,2500
2022-12-12,South India,Pulp-Free,2520
2022-12-19,South India,Pulp-Free,2550
2022-12-26,South India,Pulp-Free,2530
2023-01-02,South India,Pulp-Free,2400
2023-01-09,South India,Pulp-Free,2420
2023-01-16,South India,Pulp-Free,2410
2023-01-23,South India,Pulp-Free,2430
2023-01-30,South India,Pulp-Free,2500
2023-02-06,South India,Pulp-Free,2550
2023-02-13,South India,Pulp-Free,2600
2023-02-20,South India,Pulp-Free,2700
2023-02-27,South India,Pulp-Free,3000
2023-03-06,South India,Pulp-Free,3100
2023-03-13,South India,Pulp-Free,3200
2023-03-20,South India,Pulp-Free,3300
2023-03-27,South India,Pulp-Free,3500
2023-04-03,South India,Pulp-Free,3700
2023-04-10,South India,Pulp-Free,3800
2023-04-17,South India,Pulp-Free,3900
2023-04-24,South India,Pulp-Free,4000
2023-05-01,South India,Pulp-Free,4200
2023-05-08,South India,Pulp-Free,4300
2023-05-15,South India,Pulp-Free,4250
2023-05-22,South India,Pulp-Free,4200
2023-05-29,South India,Pulp-Free,4100
2023-06-05,South India,Pulp-Free,4000
2023-06-12,South India,Pulp-Free,3900
2023-06-19,South India,Pulp-Free,3800
2023-06-26,South India,Pulp-Free,3700
2023-07-03,South India,Pulp-Free,3600
2023-07-10,South India,Pulp-Free,3500
2023-07-17,South India,Pulp-Free,3400
2023-07-24,South India,Pulp-Free,3300
2023-07-31,South India,Pulp-Free,3200
2023-08-07,South India,Pulp-Free,3150
2023-08-14,South India,Pulp-Free,3100
2023-08-21,South India,Pulp-Free,3050
2023-08-28,South India,Pulp-Free,3000
2023-09-04,South India,Pulp-Free,2950
2023-09-11,South India,Pulp-Free,2900
2023-09-18,South India,Pulp-Free,2850
2023-09-25,South India,Pulp-Free,2800
2023-10-02,South India,Pulp-Free,2750
2023-10-09,South India,Pulp-Free,2780
2023-10-16,South India,Pulp-Free,2800
2023-10-23,South India,Pulp-Free,2820
2023-10-30,South India,Pulp-Free,2600
2023-11-06,South India,Pulp-Free,2580
2023-11-13,South India,Pulp-Free,2550
2023-11-20,South India,Pulp-Free,2560
2023-11-27,South India,Pulp-Free,2590
2023-12-04,South India,Pulp-Free,2600
2023-12-11,South India,Pulp-Free,2620
2023-12-18,South India,Pulp-Free,2650
2023-12-25,South India,Pulp-Free,2630
2021-01-04,West India,Vitamin C Boost,1200
2021-01-11,West India,Vitamin C Boost,1220
2021-01-18,West India,Vitamin C Boost,1210
2021-01-25,West India,Vitamin C Boost,1230
2021-02-01,West India,Vitamin C Boost,1300
2021-02-08,West India,Vitamin C Boost,1350
2021-02-15,West India,Vitamin C Boost,1400
2021-02-22,West India,Vitamin C Boost,1450
2021-03-01,West India,Vitamin C Boost,1800
2021-03-08,West India,Vitamin C Boost,1900
2021-03-15,West India,Vitamin C Boost,2000
2021-03-22,West India,Vitamin C Boost,2100
2021-03-29,West India,Vitamin C Boost,2400
2021-04-05,West India,Vitamin C Boost,2800
2021-04-12,West India,Vitamin C Boost,3000
2021-04-19,West India,Vitamin C Boost,3200
2021-04-26,West India,Vitamin C Boost,3400
2021-05-03,West India,Vitamin C Boost,3800
2021-05-10,West India,Vitamin C Boost,4000
2021-05-17,West India,Vitamin C Boost,3950
2021-05-24,West India,Vitamin C Boost,3800
2021-05-31,West India,Vitamin C Boost,3600
2021-06-07,West India,Vitamin C Boost,3400
2021-06-14,West India,Vitamin C Boost,3200
2021-06-21,West India,Vitamin C Boost,3000
2021-06-28,West India,Vitamin C Boost,2800
2021-07-05,West India,Vitamin C Boost,2600
2021-07-12,West India,Vitamin C Boost,2400
2021-07-19,West India,Vitamin C Boost,2200
2021-07-26,West India,Vitamin C Boost,2000
2021-08-02,West India,Vitamin C Boost,1900
2021-08-09,West India,Vitamin C Boost,1850
2021-08-16,West India,Vitamin C Boost,1800
2021-08-23,West India,Vitamin C Boost,1750
2021-08-30,West India,Vitamin C Boost,1700
2021-09-06,West India,Vitamin C Boost,1650
2021-09-13,West India,Vitamin C Boost,1600
2021-09-20,West India,Vitamin C Boost,1550
2021-09-27,West India,Vitamin C Boost,1500
2021-10-04,West India,Vitamin C Boost,1450
2021-10-11,West India,Vitamin C Boost,1480
2021-10-18,West India,Vitamin C Boost,1500
2021-10-25,West India,Vitamin C Boost,1520
2021-11-01,West India,Vitamin C Boost,1300
2021-11-08,West India,Vitamin C Boost,1280
2021-11-15,West India,Vitamin C Boost,1250
2021-11-22,West India,Vitamin C Boost,1260
2021-11-29,West India,Vitamin C Boost,1290
2021-12-06,West India,Vitamin C Boost,1300
2021-12-13,West India,Vitamin C Boost,1320
2021-12-20,West India,Vitamin C Boost,1350
2021-12-27,West India,Vitamin C Boost,1330
2022-01-03,West India,Vitamin C Boost,1250
2022-01-10,West India,Vitamin C Boost,1270
2022-01-17,West India,Vitamin C Boost,1260
2022-01-24,West India,Vitamin C Boost,1280
2022-01-31,West India,Vitamin C Boost,1350
2022-02-07,West India,Vitamin C Boost,1400
2022-02-14,West India,Vitamin C Boost,1450
2022-02-21,West India,Vitamin C Boost,1500
2022-02-28,West India,Vitamin C Boost,1900
2022-03-07,West India,Vitamin C Boost,2000
2022-03-14,West India,Vitamin C Boost,2100
2022-03-21,West India,Vitamin C Boost,2200
2022-03-28,West India,Vitamin C Boost,2500
2022-04-04,West India,Vitamin C Boost,2900
2022-04-11,West India,Vitamin C Boost,3100
2022-04-18,West India,Vitamin C Boost,3300
2022-04-25,West India,Vitamin C Boost,3500
2022-05-02,West India,Vitamin C Boost,3900
2022-05-09,West India,Vitamin C Boost,4100
2022-05-16,West India,Vitamin C Boost,4050
2022-05-23,West India,Vitamin C Boost,3900
2022-05-30,West India,Vitamin C Boost,3700
2022-06-06,West India,Vitamin C Boost,3500
2022-06-13,West India,Vitamin C Boost,3300
2022-06-20,West India,Vitamin C Boost,3100
2022-06-27,West India,Vitamin C Boost,2900
2022-07-04,West India,Vitamin C Boost,2700
2022-07-11,West India,Vitamin C Boost,2500
2022-07-18,West India,Vitamin C Boost,2300
2022-07-25,West India,Vitamin C Boost,2100
2022-08-01,West India,Vitamin C Boost,2000
2022-08-08,West India,Vitamin C Boost,1950
2022-08-15,West India,Vitamin C Boost,1900
2022-08-22,West India,Vitamin C Boost,1850
2022-08-29,West India,Vitamin C Boost,1800
2022-09-05,West India,Vitamin C Boost,1750
2022-09-12,West India,Vitamin C Boost,1700
2022-09-19,West India,Vitamin C Boost,1650
2022-09-26,West India,Vitamin C Boost,1600
2022-10-03,West India,Vitamin C Boost,1550
2022-10-10,West India,Vitamin C Boost,1580
2022-10-17,West India,Vitamin C Boost,1600
2022-10-24,West India,Vitamin C Boost,1620
2022-10-31,West India,Vitamin C Boost,1400
2022-11-07,West India,Vitamin C Boost,1380
2022-11-14,West India,Vitamin C Boost,1350
2022-11-21,West India,Vitamin C Boost,1360
2022-11-28,West India,Vitamin C Boost,1390
2022-12-05,West India,Vitamin C Boost,1400
2022-12-12,West India,Vitamin C Boost,1420
2022-12-19,West India,Vitamin C Boost,1450
2022-12-26,West India,Vitamin C Boost,1430
2023-01-02,West India,Vitamin C Boost,1350
2023-01-09,West India,Vitamin C Boost,1370
2023-01-16,West India,Vitamin C Boost,1360
2023-01-23,West India,Vitamin C Boost,1380
2023-01-30,West India,Vitamin C Boost,1450
2023-02-06,West India,Vitamin C Boost,1500
2023-02-13,West India,Vitamin C Boost,1550
2023-02-20,West India,Vitamin C Boost,1600
2023-02-27,West India,Vitamin C Boost,2000
2023-03-06,West India,Vitamin C Boost,2100
2023-03-13,West India,Vitamin C Boost,2200
2023-03-20,West India,Vitamin C Boost,2300
2023-03-27,West India,Vitamin C Boost,2600
2023-04-03,West India,Vitamin C Boost,3000
2023-04-10,West India,Vitamin C Boost,3200
2023-04-17,West India,Vitamin C Boost,3400
2023-04-24,West India,Vitamin C Boost,3600
2023-05-01,West India,Vitamin C Boost,4000
2023-05-08,West India,Vitamin C Boost,4200
2023-05-15,West India,Vitamin C Boost,4150
2023-05-22,West India,Vitamin C Boost,4000
2023-05-29,West India,Vitamin C Boost,3800
2023-06-05,West India,Vitamin C Boost,3600
2023-06-12,West India,Vitamin C Boost,3400
2023-06-19,West India,Vitamin C Boost,3200
2023-06-26,West India,Vitamin C Boost,3000
2023-07-03,West India,Vitamin C Boost,2800
2023-07-10,West India,Vitamin C Boost,2600
2023-07-17,West India,Vitamin C Boost,2400
2023-07-24,West India,Vitamin C Boost,2200
2023-07-31,West India,Vitamin C Boost,2100
2023-08-07,West India,Vitamin C Boost,2050
2023-08-14,West India,Vitamin C Boost,2000
2023-08-21,West India,Vitamin C Boost,1950
2023-08-28,West India,Vitamin C Boost,1900
2023-09-04,West India,Vitamin C Boost,1850
2023-09-11,West India,Vitamin C Boost,1800
2023-09-18,West India,Vitamin C Boost,1750
2023-09-25,West India,Vitamin C Boost,1700
2023-10-02,West India,Vitamin C Boost,1650
2023-10-09,West India,Vitamin C Boost,1680
2023-10-16,West India,Vitamin C Boost,1700
2023-10-23,West India,Vitamin C Boost,1720
2023-10-30,West India,Vitamin C Boost,1500
2023-11-06,West India,Vitamin C Boost,1480
2023-11-13,West India,Vitamin C Boost,1450
2023-11-20,West India,Vitamin C Boost,1460
2021-11-27,West India,Vitamin C Boost,1490
2023-12-04,West India,Vitamin C Boost,1500
2023-12-11,West India,Vitamin C Boost,1520
2023-12-18,West India,Vitamin C Boost,1550
2023-12-25,West India,Vitamin C Boost,1530
`;

export const getSalesData = async (): Promise<SalesRecord[]> => {
  const parsedData = d3.csvParse(CSV_DATA);

  return parsedData.map((record) => ({
    date: new Date(record.Date as string),
    store: record.Store as string,
    product: record.Product as string,
    sales: Number(record.Sales),
  }));
};
