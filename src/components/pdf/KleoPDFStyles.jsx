'use client'

import { Font, StyleSheet } from '@react-pdf/renderer'

Font.register({
  family: 'Inter',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjQ.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hjQ.ttf',
      fontWeight: 600,
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hjQ.ttf',
      fontWeight: 700,
    },
  ],
})

// --- Kleo Design Tokens ---

export const kleo = {
  // Primary palette
  amarillo: '#FFD700',
  amarilloDark: '#D4A800',
  amarilloLight: '#FFF8DC',

  // Neutrals
  gray900: '#111827',
  gray700: '#374151',
  gray500: '#6B7280',
  gray400: '#9CA3AF',
  gray200: '#E5E7EB',
  gray100: '#F3F4F6',
  gray50: '#F9FAFB',
  white: '#FFFFFF',

  // Accents
  teal: '#0D9488',
  tealLight: '#CCFBF1',
  tealDark: '#115E59',
  rose: '#E11D48',
  roseLight: '#FFF1F2',
  roseBg: '#FCE7F3',
  blue: '#2563EB',
  blueLight: '#EFF6FF',

  // Fonts
  fontFamily: 'Inter',
  fontBase: 9.5,
  fontSm: 8,
  fontXs: 7,
  fontMd: 10.5,
  fontLg: 13,
  fontXl: 18,
  fontTitle: 22,
}

// --- Reusable base styles ---

export const basePDF = StyleSheet.create({
  page: {
    fontFamily: kleo.fontFamily,
    fontSize: kleo.fontBase,
    color: kleo.gray900,
    paddingTop: 0,
    paddingBottom: 56,
    paddingHorizontal: 0,
  },

  // Header band
  headerBand: {
    backgroundColor: kleo.gray900,
    paddingHorizontal: 44,
    paddingTop: 32,
    paddingBottom: 24,
  },
  headerLogo: {
    fontSize: 24,
    fontWeight: 700,
    color: kleo.amarillo,
    letterSpacing: 1,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: kleo.fontTitle,
    fontWeight: 700,
    color: kleo.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: kleo.fontMd,
    fontWeight: 400,
    color: kleo.gray400,
  },

  // Meta strip below header
  metaStrip: {
    flexDirection: 'row',
    backgroundColor: kleo.gray50,
    borderBottomWidth: 1,
    borderBottomColor: kleo.gray200,
    paddingHorizontal: 44,
    paddingVertical: 10,
    gap: 24,
  },
  metaItem: {
    fontSize: kleo.fontSm,
    color: kleo.gray500,
  },
  metaLabel: {
    fontWeight: 700,
    color: kleo.gray700,
  },

  // Content area
  content: {
    paddingHorizontal: 44,
    paddingTop: 20,
  },

  // Section divider (INTRODUCCION, DESARROLLO, CIERRE)
  sectionDivider: {
    backgroundColor: kleo.amarillo,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 20,
    marginBottom: 14,
  },
  sectionDividerText: {
    fontSize: kleo.fontSm,
    fontWeight: 700,
    color: kleo.gray900,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  // Numbered block (1, 2, 3...)
  numberedBlock: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  numberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: kleo.gray900,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  numberBadgeText: {
    fontSize: kleo.fontSm,
    fontWeight: 700,
    color: kleo.white,
    textAlign: 'center',
    lineHeight: 22,
  },
  numberedContent: {
    flex: 1,
  },
  numberedTitle: {
    fontSize: kleo.fontMd,
    fontWeight: 700,
    color: kleo.gray900,
    marginBottom: 6,
  },

  // Card container
  card: {
    backgroundColor: kleo.gray50,
    borderWidth: 1,
    borderColor: kleo.gray200,
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },

  // Bullet list
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingRight: 12,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: kleo.amarillo,
    marginRight: 8,
    marginTop: 4,
  },
  bulletText: {
    flex: 1,
    fontSize: kleo.fontBase,
    color: kleo.gray700,
    lineHeight: 1.5,
  },

  // Highlight box (for R.M., tips, etc.)
  highlightBox: {
    backgroundColor: kleo.tealLight,
    borderLeftWidth: 3,
    borderLeftColor: kleo.teal,
    borderRadius: 4,
    padding: 10,
    marginTop: 6,
    marginBottom: 8,
  },
  highlightLabel: {
    fontSize: kleo.fontXs,
    fontWeight: 700,
    color: kleo.teal,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  highlightText: {
    fontSize: kleo.fontBase,
    color: kleo.tealDark,
    lineHeight: 1.5,
  },

  // Rose highlight (for R.M. answers)
  roseBox: {
    backgroundColor: kleo.roseLight,
    borderLeftWidth: 3,
    borderLeftColor: kleo.rose,
    borderRadius: 4,
    padding: 10,
    marginTop: 6,
    marginBottom: 8,
  },
  roseLabel: {
    fontSize: kleo.fontXs,
    fontWeight: 700,
    color: kleo.rose,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  roseText: {
    fontSize: kleo.fontBase,
    color: kleo.gray700,
    lineHeight: 1.5,
  },

  // Reference tag (Diapositiva 3, Video min 2:00)
  refTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: kleo.blueLight,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 4,
    marginRight: 6,
  },
  refTagText: {
    fontSize: kleo.fontXs,
    fontWeight: 600,
    color: kleo.blue,
  },

  // Body text
  bodyText: {
    fontSize: kleo.fontBase,
    color: kleo.gray700,
    lineHeight: 1.5,
    marginBottom: 6,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 44,
    right: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: kleo.gray200,
    paddingTop: 8,
  },
  footerLeft: {
    fontSize: kleo.fontXs,
    color: kleo.gray400,
  },
  footerRight: {
    fontSize: kleo.fontXs,
    fontWeight: 600,
    color: kleo.gray400,
  },
})
