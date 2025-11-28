
import { VersionLog } from './types';

import v2_42_3 from './logs/v2.42.3';
import v2_42_2 from './logs/v2.42.2';
import v2_42_1 from './logs/v2.42.1';
import v2_42_0 from './logs/v2.42.0';
import v2_41_1 from './logs/v2.41.1';
import v2_41_0 from './logs/v2.41.0';
import v2_40_1 from './logs/v2.40.1';
import v2_40_0 from './logs/v2.40.0';
import v2_39_1 from './logs/v2.39.1';
import v2_39_0 from './logs/v2.39.0';
import v2_38_0 from './logs/v2.38.0';
import v2_37_0 from './logs/v2.37.0';
import v2_36_0 from './logs/v2.36.0';
import v2_35_1 from './logs/v2.35.1';
import v2_35_0 from './logs/v2.35.0';
import v2_34_1 from './logs/v2.34.1';
import v2_34_0 from './logs/v2.34.0';
import v2_33_3 from './logs/v2.33.3';
import v2_33_2 from './logs/v2.33.2';
import v2_33_1 from './logs/v2.33.1';
import v2_33_0 from './logs/v2.33.0';
import v2_32_1 from './logs/v2.32.1';
import v2_32_0 from './logs/v2.32.0';
import v2_31_1 from './logs/v2.31.1';
import v2_31_0 from './logs/v2.31.0';
import v2_30_2 from './logs/v2.30.2';
import v2_30_1 from './logs/v2.30.1';
import v2_30_0 from './logs/v2.30.0';
import v2_29_0 from './logs/v2.29.0';
import v2_28_1 from './logs/v2.28.1';
import v2_28_0 from './logs/v2.28.0';
import v2_27_0 from './logs/v2.27.0';
import v2_26_0 from './logs/v2.26.0';
import v2_25_0 from './logs/v2.25.0';
import v2_24_0 from './logs/v2.24.0';
import v2_23_0 from './logs/v2.23.0';
import v2_20_0 from './logs/v2.20.0';
import v2_10_0 from './logs/v2.10.0';
import v2_4_0 from './logs/v2.4.0';

const rawVersions: VersionLog[] = [
  v2_42_3,
  v2_42_2,
  v2_42_1,
  v2_42_0,
  v2_41_1,
  v2_41_0,
  v2_40_1,
  v2_40_0,
  v2_39_1,
  v2_39_0,
  v2_38_0,
  v2_37_0,
  v2_36_0,
  v2_35_1,
  v2_35_0,
  v2_34_1,
  v2_34_0,
  v2_33_3,
  v2_33_2,
  v2_33_1,
  v2_33_0,
  v2_32_1,
  v2_32_0,
  v2_31_1,
  v2_31_0,
  v2_30_2,
  v2_30_1,
  v2_30_0,
  v2_29_0,
  v2_28_1,
  v2_28_0,
  v2_27_0,
  v2_26_0,
  v2_25_0,
  v2_24_0,
  v2_23_0,
  v2_20_0,
  v2_10_0,
  v2_4_0
];

// Sort versions by date (newest first)
export const VERSIONS = rawVersions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// Export the latest version string for the footer
export const LATEST_VERSION = VERSIONS[0]?.version || 'Unknown';
