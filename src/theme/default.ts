export default {
  button: {
    base:
      'leading-tight border border-solid transition ease-in-out outline-none focus:outline-none',
    color: {
      danger:
        'bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600 focus:bg-red-600 focus:border-red-600 active:bg-red-600 active:border-red-600 text-white hover:text-white active:text-white focus:text-white',
      default:
        'bg-white border-gray-300 hover:bg-white hover:border-gray-600 focus:bg-white focus:border-gray-600 active:bg-white active:border-gray-600 text-black',
      link:
        'text-blue-500 bg-none border-transparent hover:text-blue-600 hover:bg-none hover:border-none focus:text-blue-600 focus:bg-none focus:border-none active:text-blue-600 active:bg-none active:border-none',
      primary:
        'bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600 focus:bg-blue-600 focus:border-blue-600 active:bg-blue-600 active:border-blue-600 text-white hover:text-white active:text-white focus:text-white',
      success:
        'bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600 focus:bg-green-600 focus:border-green-600 active:bg-green-600 active:border-green-600 text-white hover:text-white active:text-white focus:text-white',
      warning:
        'bg-yellow-500 border-yellow-500 hover:bg-yellow-600 hover:border-yellow-600 focus:bg-yellow-600 focus:border-yellow-600 active:bg-yellow-600 active:border-yellow-600 text-white hover:text-white active:text-white focus:text-white',
    },
    size: {
      sm: 'text-xs py-1 px-2',
      md: 'text-sm py-2 px-3',
      lg: 'text-base py-3 px-4',
    },
  },
  checkbox: {
    color: {
      danger: 'text-red-500 checked:border-red-500',
      default: 'text-blue-500 checked:border-blue-500',
      primary: 'text-blue-500 checked:border-blue-500',
      success: 'text-green-500 checked:border-green-500',
      warning: 'text-yellow-500 checked:border-yellow-500',
    },
  },
  disabled: 'opacity-50 bg-gray-100 cursor-not-allowed',
  form: {
    base:
      'border border-solid focus:border-black transition-colors duration-500 active:border-blue-500 outline-none focus:outline-none focus:border-blue-500 leading-tight',
    default: 'border-gray-300',
    success: 'border-green-500',
    invalid: 'border-red-400',
    size: {
      sm: 'text-xs py-1 px-2',
      md: 'text-sm p-2',
      lg: 'text-base py-2 px-3',
    },
  },
};
