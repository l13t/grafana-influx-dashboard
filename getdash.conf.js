// Configuration JS file for getdash.app.js

define(function getDashConf () {
  'use strict';

  // You can add custom 'alias', 'prefix', 'separator', 'datasources', 'multi', 'regexp' per plugin.
  var pluginConfProto = {
    'alias': undefined,
    //'prefix': 'collectd\\.',        // Special characters in prefix should be escaped by '\\'.
                                      // If you use no prefix set it to undefined or comment it out.
    'separator': ',',                 // In backend query separator is automatically escaped by '\\'.
    //'datasources': [ 'graphite' ],  // You can add custom datasources per plugin.
                                      // If datasources is not set all grafana datasources will be used.
  };

  // Plugin constructor
  function Plugin (config) {
    Object.defineProperty(this, 'config', {
      value: _.merge({}, pluginConfProto, config),
      enumerable: false
    });
  }

  // collectd plugins configuration
  var plugins = {};
  Object.defineProperty(plugins, 'groups', {
    value: {},
    enumerable: false
  });

  // plugin groups configuration
  plugins.groups.system = [
    'cpu',
    'memory',
    'load',
    'swap',
    'interface',
    'ping',
    'connstate',
    'df',
    'disk',
    'processes',
    'entropy',
    'users',
    'uptime',
    'nfs',
    'ipvs'
  ];
  plugins.groups.middleware = [
    'redis',
    'memcache',
    'rabbitmq',
    'elasticsearch',
    'nginx',
    'zookeeper',
    'mesos',
    'apache'
  ];
  plugins.groups.database = [
    'elasticsearch',
    'postgresql'
  ];


  // collectd cpu plugin configuration: https://github.com/anryko/cpu-collectd-plugin
  plugins.cpu = new Plugin({ 'alias': 'cpu' });
  plugins.cpu.config.merge = [ 'instance' ];

  plugins.cpu.cpu = {
    'graph': {
      'system': { 'color': '#EAB839' },
      'user': { 'color': '#508642' },
      'idle': { 'color': '#303030' },
      'wait': { 'color': '#890F02' },
      'steal': { 'color': '#E24D42' },
      'nice': { 'color': '#9400D3' },
      'softirq': { 'color': '#E9967A' },
      'interrupt': { 'color': '#1E90FF' }
    },
    'panel': {
      'title': 'CPU',
      'y_formats': [ 'percent' ],
      'fill': 7,
      'stack': true,
      'tooltip': { 'value_type': 'individual' },
      'percentage': true
    }
  };


  // collectd memory plugin configuration
  plugins.memory = new Plugin();

  plugins.memory.memory = {
    'graph': {
      'used': {
        'color': '#1F78C1',
        'alias': 'used'
      },
      'cached': {
        'color': '#EF843C',
        'alias': 'cached'
      },
      'buffered': {
        'color': '#CCA300',
        'alias': 'buffered'
      },
      'free': {
        'color': '#629E51',
        'alias': 'free'
      }
    },
    'panel': {
      'title': 'Memory',
      'y_formats': [ 'bytes' ],
      'stack': true,
      'tooltip': { 'value_type': 'individual' }
    }
  };


  // collectd load plugin configuration
  plugins.load = new Plugin();

  plugins.load.midterm = {
    'graph': {
      'load': { }
    },
    'panel': {
      'title': 'Load Average'
    }
  };


  // collectd swap plugin configuration
  plugins.swap = new Plugin();

  plugins.swap.swap = {
    'graph': {
      'used': {
        'color': '#1F78C1',
        'alias': 'used'
      },
      'cached': {
        'color': '#EAB839',
        'alias': 'cached'
      },
      'free': {
        'color': '#508642',
        'alias': 'free'
      }
    },
    'panel': {
      'title': 'Swap',
      'y_formats': [ 'bytes' ],
      'stack': true,
      'tooltip': { 'value_type': 'individual' }
    }
  };

  plugins.swap.swapIO = {
    'graph': {
      'in': {
        'color': '#447EBC',
        'apply': 'derivative'
      },
      'out': {
        'color': '#508642',
        'apply': 'derivative',
        'math': '* -1'
      }
    },
    'panel': {
      'title': 'Swap IO',
      'grid': { 'max': null, 'min': null, 'leftMin': null },
      'y_formats': [ 'bytes' ]
    }
  };


  // collectd interface plugin configuration
  plugins.interface = new Plugin();
  plugins.interface.config.multi = true;

  plugins.interface.traffic = {
    'graph': {
      'rx': {
        'color': '#447EBC',
        'alias': 'octets-rx',
        'apply': 'derivative',
        'math': '* -1',
        'type': 'if_octets'
      },
      'tx': {
        'color': '#508642',
        'alias': 'octets-tx',
        'apply': 'derivative',
        'type': 'if_octets'
      }
    },
    'panel': {
      'title': 'Network Traffic on @metric',
      'y_formats': [ 'Bps' ],
      'grid': { 'max': null, 'min': null, 'leftMin': null }
    }
  };

  plugins.interface.packets = {
    'graph': {
      'rx': {
        'color': '#447EBC',
        'alias': 'packets-rx',
        'apply': 'derivative',
        'math': '* -1',
        'type': 'if_packets'
      },
      'tx': {
        'color': '#508642',
        'alias': 'packets-tx',
        'apply': 'derivative',
        'type': 'if_packets'
      }
    },
    'panel': {
      'title': 'Network Packets on @metric',
      'y_formats': [ 'pps' ],
      'grid': { 'max': null, 'min': null, 'leftMin': null }
    }
  };

  // collectd ipvs plugin configuration
  plugins.ipvs = new Plugin({ 'alias': 'ipvs'});

  plugins.ipvs.ipvs = {
    'graph': {
      'ipvs_value': {
        'apply': 'derivative'
      }
    },
    'panel': {
      'title': 'Loadbalanced connections',
      'y_formats': [ 'pps' ]
    }
  };

  // collectd ping plugin configuration
  plugins.ping = new Plugin();

  plugins.ping.ping = {
    'graph': {
      'ping_value': { }
    },
    'panel': {
      'title': 'Ping',
      'y_formats': [ 'ms' ]
    }
  };


  // collectd nfs plugin configuration
  plugins.nfs = new Plugin({ 'alias': 'nfs' });

  plugins.nfs.nfs = {
    'graph': {
      '/.*/': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'NFS for @metric',
      'y_formats': [ 'pps' ]
    }
  };


  // collectd connstate plugin configuration: https://github.com/anryko/connstate-collectd-plugin
  plugins.connstate = new Plugin({ 'alias': 'connstate' });
  plugins.connstate.config.merge = [ 'instance' ];

  plugins.connstate.connStates = {
    'graph': {
      'connstate': { 'apply': 'sum' }
    },
    'panel': {
      'title': 'Network Connections States',
      'y_formats': [ 'short' ]
    }
  };


  // collectd df plugin configuration
  plugins.df = new Plugin();
  plugins.df.config.multi = true;

  plugins.df.space = {
    'graph': {
      'used': {
        'color': '#447EBC',
        'type': 'df_complex'
      },
      'reserved': {
        'color': '#EAB839',
        'type': 'df_complex'
      },
      'free': {
        'color': '#508642',
        'type': 'df_complex'
      }
    },
    'panel': {
      'title': 'Disk space for @metric',
      'y_formats': [ 'bytes' ],
      'stack': true,
      'tooltip': { 'value_type': 'individual' }
    }
  };

  plugins.df.inode = {
    'graph': {
      'used': {
        'color': '#447EBC',
        'type': 'df_inodes'
      },
      'reserved': {
        'color': '#EAB839',
        'type': 'df_inodes'
      },
      'free': {
        'color': '#508642',
        'type': 'df_inodes'
      }
    },
    'panel': {
      'title': 'Disk inodes for @metric',
      'y_formats': [ 'short' ],
      'stack': true,
      'tooltip': { 'value_type': 'individual' }
    }
  };


  // collectd disk plugin configuration
  plugins.disk = new Plugin();
  plugins.disk.config.multi = true;
  plugins.disk.config.regexp = /\d$/;

  plugins.disk.diskOps = {
    'graph': {
      'read': {
        'color': '#447EBC',
        'apply': 'derivative',
        'type': 'disk_ops'
      },
      'write': {
        'color': '#508642',
        'math': '* -1',
        'apply': 'derivative',
        'type': 'disk_ops'
      }
    },
    'panel': {
      'title': 'Disk Operations for @metric',
      'grid': { 'max': null, 'min': null, 'leftMin': null },
      'y_formats': [ 'iops' ]
    }
  };

  plugins.disk.diskOctets = {
    'graph': {
      'read': {
        'color': '#447EBC',
        'apply': 'derivative',
        'type': 'disk_octets'
      },
      'write': {
        'color': '#508642',
        'math': '* -1',
        'apply': 'derivative',
        'type': 'disk_octets'
      }
    },
    'panel': {
      'title': 'Disk Traffic for @metric',
      'grid': { 'max': null, 'min': null, 'leftMin': null },
      'y_formats': [ 'bytes' ]
    }
  };

  plugins.disk.diskTime = {
    'graph': {
      'read': {
        'color': '#447EBC',
        'apply': 'derivative',
        'type': 'disk_time'
      },
      'write': {
        'color': '#508642',
        'math': '* -1',
        'apply': 'derivative',
        'type': 'disk_time'
      }
    },
    'panel': {
      'title': 'Disk Wait for @metric',
      'grid': { 'max': null, 'min': null, 'leftMin': null },
      'y_formats': [ 'ms' ]
    }
  };


  // collectd processes plugin configuration
  plugins.processes = new Plugin();

  plugins.processes.state = {
    'graph': {
      'sleeping': { 'color': '#EAB839', 'alias': 'sleeping' },
      'running': { 'color': '#508642', 'alias': 'running' },
      'stopped': { 'color': '#E9967A', 'alias': 'stopped' },
      'blocked': { 'color': '#890F02', 'alias': 'blocked' },
      'zombies': { 'color': '#E24D42', 'alias': 'zombies' },
      'paging': { 'color': '#9400D3', 'alias': 'paging' }
    },
    'panel': {
      'title': 'Processes State',
      'y_formats': [ 'short' ]
    }
  };

  plugins.processes.fork = {
    'graph': {
      'processes': {
        'alias': 'processes',
        'apply': 'derivative',
        'type': 'fork_rate'
      }
    },
    'panel': {
      'title': 'Processes Fork Rate',
      'y_formats': [ 'pps' ]
    }
  };


  // collectd entropy plugin configuration
  plugins.entropy = new Plugin();

  plugins.entropy.entropy = {
    'graph': {
      'entropy': { }
    },
    'panel': {
      'title': 'Entropy',
      'y_formats': [ 'short' ]
    }
  };


  // collectd users plugin configuration
  plugins.users = new Plugin();

  plugins.users.users = {
    'graph': {
      'users': {
        'alias': 'count',
        'apply': 'max'
      }
    },
    'panel': {
      'title': 'Users'
    }
  };


  // collectd uptime plugin configuration
  plugins.uptime = new Plugin();

  plugins.uptime.uptime = {
    'graph': {
      'uptime': { }
    },
    'panel': {
      'title': 'System Uptime',
      'y_formats': [ 's' ]
    }
  };


  // collectd redis plugin configuration: https://github.com/powdahound/redis-collectd-plugin
  plugins.redis = new Plugin({ 'alias': 'redis' });

  plugins.redis.memory = {
    'graph': {
      'used_memory': {
        'color': '#447EBC',
        'alias': 'memory-used'
      }
    },
    'panel': {
      'title': 'Redis Memomy',
      'y_formats': [ 'bytes' ]
    }
  };

  plugins.redis.commands = {
    'graph': {
      'commands_processed': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'Redis Commands',
      'y_formats': [ 'ops' ]
    }
  };

  plugins.redis.connections = {
    'graph': {
      'connections_received': {
        'color': '#447EBC',
        'apply': 'derivative'
      },
      'blocked_clients': {
        'color': '#E24D42',
        'apply': 'derivative'
      },
      'connected_clients': {
        'color': '#508642',
        'apply': 'derivative'
      }
    },
    'panel': {
      'title': 'Redis Connections',
      'y_formats': [ 'ops' ]
    }
  };

  plugins.redis.unsaved = {
    'graph': {
      'changes_since_last_save': {
        'color': '#E24D42',
        'alias': 'changes_unsaved'
      }
    },
    'panel': {
      'title': 'Redis Unsaved Changes',
      'y_formats': [ 'short' ]
    }
  };

  plugins.redis.slaves = {
    'graph': {
      'connected_slaves': { 'color': '#508642' }
    },
    'panel': {
      'title': 'Redis Connected Slaves'
    }
  };

  plugins.redis.keys = {
    'graph': {
      'keys': { }
    },
    'panel': {
      'title': 'Redis DB Keys',
      'y_formats': [ 'short' ]
    }
  };

  plugins.redis.replMaster = {
    'graph': {
      'master_repl_offset': { }
    },
    'panel': {
      'title': 'Redis Replication Master',
      'y_formats': [ 'short' ]
    }
  };

  plugins.redis.replBacklogCounters = {
    'graph': {
      'repl_backlog_active': { 'alias': 'backlog' },
      'repl_backlog_histlen': { 'alias': 'history' }
    },
    'panel': {
      'title': 'Redis Replication Backlog Counters',
      'y_formats': [ 'short' ]
    }
  };

  plugins.redis.replBacklogSize = {
    'graph': {
      'backlog_first_byte_offset': { 'alias': 'offset' },
      'repl_backlog_size': { 'alias': 'backlog_size' }
    },
    'panel': {
      'title': 'Redis Replication Backlog Size',
      'y_formats': [ 'bytes' ]
    }
  };

  plugins.redis.uptime = {
    'graph': {
      'uptime_in_seconds': { }
    },
    'panel': {
      'title': 'Redis Uptime',
      'y_formats': [ 's' ]
    }
  };


  // collectd memcached plugin configuration
  plugins.memcache = new Plugin({ 'alias': 'mc' });

  plugins.memcache.memory = {
    'graph': {
      'used': {
        'color': '#447EBC',
        'alias': 'used'
      },
      'free': {
        'color': '#508642',
        'alias': 'free'
      }
    },
    'panel': {
      'title': 'Memcached Memomy',
      'y_formats': [ 'bytes' ],
      'stack': true,
      'tooltip': { 'value_type': 'individual' }
    }
  };

  plugins.memcache.connections = {
    'graph': {
      'current': { 'type': 'memcached_connections' }
    },
    'panel': {
      'title': 'Memcached Connections',
      'y_formats': [ 'bytes' ]
    }
  };

  plugins.memcache.items = {
    'graph': {
      'current': { 'type': 'memcached_items' }
    },
    'panel': {
      'title': 'Memcached Items',
      'y_formats': [ 'bytes' ]
    }
  };

  plugins.memcache.commands = {
    'graph': {
      'flush': { 'apply': 'derivative' },
      'get': { 'apply': 'derivative' },
      'set': { 'apply': 'derivative' },
      'touch': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'Memcached Commands',
      'y_formats': [ 'ops' ]
    }
  };

  plugins.memcache.octets = {
    'graph': {
      'tx': {
        'color': '#447EBC',
        'apply': 'derivative'
      },
      'rx': {
        'color': '#508642',
        'math': '* -1',
        'apply': 'derivative'
      }
    },
    'panel': {
      'title': 'Memcached Traffic',
      'grid': { 'max': null, 'min': null, 'leftMin': null },
      'y_formats': [ 'bps' ]
    }
  };

  plugins.memcache.operations = {
    'graph': {
      'hits': { 'apply': 'derivative' },
      'misses': { 'apply': 'derivative' },
      'evictions': { 'apply': 'derivative' },
      'incr_hits': { 'apply': 'derivative' },
      'decr_hits': { 'apply': 'derivative' },
      'incr_misses': { 'apply': 'derivative' },
      'decr_misses': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'Memcached Operations',
      'y_formats': [ 'ops' ]
    }
  };

  plugins.memcache.hits = {
    'graph': {
      'hitratio': { }
    },
    'panel': {
      'title': 'Memcached Hitratio',
      'y_formats': [ 'percent' ]
    }
  };

  plugins.memcache.ps = {
    'graph': {
      'processes': { },
      'threads': { }
    },
    'panel': {
      'title': 'Memcached Process Stats',
      'y_formats': [ 'short' ]
    }
  };

  plugins.memcache.cpu = {
    'graph': {
      'syst': {
        'color': '#EAB839',
        'apply': 'derivative'
      },
      'user': {
        'color': '#508642',
        'apply': 'derivative'
      }
    },
    'panel': {
      'title': 'Memcached CPU Time',
      'stack': true,
      'tooltip': { 'value_type': 'individual' }
    }
  };

  // collectd rabbitmq plugin configuration: https://github.com/kozdincer/rabbitmq_collectd_plugin
  plugins.rabbitmq = new Plugin({ 'alias': 'rmq' });

  plugins.rabbitmq.rates = {
    'graph': {
      'ack_rate': { 'alias': 'rate-ack' },
      'deliver_rate': { 'alias': 'rate-deliver' },
      'publish_rate': { 'alias': 'rate-publish' }
    },
    'panel': {
      'title': 'RabbitMQ Rates'
    }
  };

  plugins.rabbitmq.channels = {
    'graph': {
      'channels': { 'alias': 'channels' },
      'queues': { 'alias': 'queues' }
    },
    'panel': {
      'title': 'RabbitMQ Channels and Queues',
      'y_formats': [ 'short' ]
    }
  };

  plugins.rabbitmq.connections = {
    'graph': {
      'connections': { 'alias': 'connections' },
      'consumers': { 'alias': 'consumers' },
      'exchanges': { 'alias': 'exchanges' }
    },
    'panel': {
      'title': 'RabbitMQ Connections',
      'y_formats': [ 'short' ]
    }
  };

  plugins.rabbitmq.messages = {
    'graph': {
      'messages_total': { 'alias': 'messages-total' },
      'messages_unack': { 'alias': 'messages-unack' },
      'messages_ready': { 'alias': 'messages-ready' }
    },
    'panel': {
      'title': 'RabbitMQ Messages',
      'y_formats': [ 'short' ]
    }
  };

  plugins.rabbitmq.fd = {
    'graph': {
      'fd_total': {
        'color': '#508642',
        'alias': 'fd-total'
      },
      'fd_used': {
        'color': '#447EBC',
        'alias': 'fd-used'
      }
    },
    'panel': {
      'title': 'RabbitMQ File Descriptors',
      'y_formats': [ 'short' ]
    }
  };

  plugins.rabbitmq.memory = {
    'graph': {
      'mem_limit': {
        'color': '#508642',
        'alias': 'mem-limit'
      },
      'mem_used': {
        'color': '#447EBC',
        'alias': 'mem-used'
      }
    },
    'panel': {
      'title': 'RabbitMQ Memory',
      'y_formats': [ 'bytes' ]
    }
  };

  plugins.rabbitmq.proc = {
    'graph': {
      'proc_total': {
        'color': '#508642',
        'alias': 'proc-total'
      },
      'proc_used': {
        'color': '#447EBC',
        'alias': 'proc-used'
      }
    },
    'panel': {
      'title': 'RabbitMQ Proc',
      'y_formats': [ 'short' ]
    }
  };

  plugins.rabbitmq.sockets = {
    'graph': {
      'sockets_total': {
        'color': '#508642',
        'alias': 'sockets-total'
      },
      'sockets_used': {
        'color': '#447EBC',
        'alias': 'sockets-used'
      }
    },
    'panel': {
      'title': 'RabbitMQ Sockets',
      'y_formats': [ 'short' ]
    }
  };


  // collectd elasticsearch plugin configuration: https://github.com/phobos182/collectd-elasticsearch
  plugins.elasticsearch = new Plugin({ 'alias': 'es' });

  plugins.elasticsearch.http = {
    'graph': {
      'http.current_open': { 'alias': 'http-open' }
    },
    'panel': {
      'title': 'ElasticSearch HTTP Open',
      'y_formats': [ 'short' ]
    }
  };

  plugins.elasticsearch.transportCount = {
    'graph': {
      'transport.rx.count': {
        'apply': 'derivative',
        'alias': 'transport-rx'
      },
      'transport.tx.count': {
        'apply': 'derivative',
        'math': '* -1',
        'alias': 'transport-tx'
      }
    },
    'panel': {
      'title': 'ElasticSearch Transport Counters',
      'grid': { 'max': null, 'min': null, 'leftMin': null },
      'y_formats': [ 'pps' ]
    }
  };

  plugins.elasticsearch.transportSize = {
    'graph': {
      'transport.rx.size': {
        'alias': 'transport-rx',
        'apply': 'derivative'
      },
      'transport.tx.size': {
        'alias': 'transport-tx',
        'math': '* -1',
        'apply': 'derivative'
      }
    },
    'panel': {
      'title': 'ElasticSearch Transport Size',
      'grid': { 'max': null, 'min': null, 'leftMin': null },
      'y_formats': [ 'bps' ]
    }
  };

  plugins.elasticsearch.idxTimes = {
    'graph': {
      '/^indices\\..*time$/': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'ElasticSearch Indices Times',
      'y_formats': [ 'ms' ]
    }
  };

  plugins.elasticsearch.idxTotals = {
    'graph': {
      '/^indices\\..*total$/': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'ElasticSearch Indices Totals',
      'y_formats': [ 'short' ]
    }
  };

  plugins.elasticsearch.idxDocs = {
    'graph': {
      '/^indices\\.docs\\./': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'ElasticSearch Indices Docs',
      'y_formats': [ 'short' ]
    }
  };

  plugins.elasticsearch.idxCacheEvictions = {
    'graph': {
      '/^indices\\.cache\\..*\\.eviction(s)?$/': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'ElasticSearch Indices Cache Evictions',
      'y_formats': [ 'ops' ]
    }
  };

  plugins.elasticsearch.jvmHeapPercent = {
    'graph': {
      'jvm.mem.heap-used-percent': { 'alias': 'jvm-heap-used' }
    },
    'panel': {
      'title': 'ElasticSearch JVM Heap Usage',
      'y_formats': [ 'percent' ]
    }
  };

  plugins.elasticsearch.jvmMemHeap = {
    'graph': {
      'jvm.mem.heap-committed': {
        'color': '#508642',
        'alias': 'jvm-heap-commited'
      },
      'jvm.mem.heap-used': {
        'color': '#447EBC',
        'alias': 'jvm-heap-used'
      }
    },
    'panel': {
      'title': 'ElasticSearch JVM Heap Memory Usage',
      'y_formats': [ 'bytes' ]
    }
  };

  plugins.elasticsearch.jvmMemNonHeap = {
    'graph': {
      'jvm.mem.non-heap-committed': {
        'color': '#508642',
        'alias': 'jvm-non-heap-commited'
      },
      'jvm.mem.non-heap-used': {
        'color': '#447EBC',
        'alias': 'jvm-non-heap-used'
      }
    },
    'panel': {
      'title': 'ElasticSearch JVM Non Heap Memory Usage',
      'y_formats': [ 'bytes' ]
    }
  };

  plugins.elasticsearch.jvmThreads = {
    'graph': {
      'jvm.threads.peak': { 'color': '#508642' },
      'jvm.threads.count': { 'color': '#447EBC' }
    },
    'panel': {
      'title': 'ElasticSearch JVM Threads',
      'y_formats': [ 'short' ]
    }
  };

  plugins.elasticsearch.jvmGCCount = {
    'graph': {
      'jvm.gc.old-count': { 'apply': 'derivative' },
      'jvm.gc.count': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'ElasticSearch JVM GC Count',
      'y_formats': [ 'ops' ]
    }
  };

  plugins.elasticsearch.jvmGCTime = {
    'graph': {
      'jvm.gc.old-time': { 'apply': 'derivative' },
      'jvm.gc.time': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'ElasticSearch JVM GC Time',
      'y_formats': [ 'ms' ]
    }
  };

  plugins.elasticsearch.threadPoolCompleted = {
    'graph': {
      '/^thread_pool\\..*completed$/': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'ElasticSearch Thread Pool Completed',
      'y_formats': [ 'ops' ]
    }
  };

  plugins.elasticsearch.threadPoolRejected = {
    'graph': {
      '/^thread_pool\\..*rejected$/': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'ElasticSearch Thread Pool Rejected',
      'y_formats': [ 'ops' ]
    }
  };

  plugins.elasticsearch.threadPoolAcrive = {
    'graph': {
      '/^thread_pool\\..*active$/': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'ElasticSearch Thread Pool Active',
      'y_formats': [ 'ops' ]
    }
  };

  plugins.elasticsearch.threadPoolLargest = {
    'graph': {
      '/^thread_pool\\..*largest$/': { }
    },
    'panel': {
      'title': 'ElasticSearch Thread Pool Largest',
      'y_formats': [ 'short' ]
    }
  };

  plugins.elasticsearch.threadPoolQueue = {
    'graph': {
      '/^thread_pool\\..*queue$/': { }
    },
    'panel': {
      'title': 'ElasticSearch Thread Pool Queue',
      'y_formats': [ 'short' ]
    }
  };

  plugins.elasticsearch.threadPoolThread = {
    'graph': {
      '/^thread_pool\\..*threads$/': { }
    },
    'panel': {
      'title': 'ElasticSearch Thread Pool Threads',
      'y_formats': [ 'short' ]
    }
  };


  // collectd nginx plugin
  plugins.nginx = new Plugin();

  plugins.nginx.requests = {
    'graph': {
      'nginx': {
        'apply': 'derivative',
        'alias': 'requests',
        'type': 'nginx_requests'
      }
    },
    'panel': {
      'title': 'Nginx Requests',
      'y_formats': [ 'ops' ]
    }
  };

  plugins.nginx.connections = {
    'graph': {
      'accepted': {
        'color': '#1F78C1',
        'apply': 'derivative'
      },
      'handled': {
        'color': '#629E51',
        'apply': 'derivative'
      }
    },
    'panel': {
      'title': 'Nginx Connections',
      'y_formats': [ 'ops' ]
    }
  };

  plugins.nginx.connStates = {
    'graph': {
      'active': { },
      'reading': { },
      'waiting': { },
      'writing': { }
    },
    'panel': {
      'title': 'Nginx Connections States',
      'y_formats': [ 'short' ]
    }
  };


  // collectd apache plugin
  plugins.apache = new Plugin({ 'alias': 'apache' });

  plugins.apache.bytes = {
    'graph': {
      'apache_value': {
        'type': 'apache_bytes',
        'color': '#CCFF66',
        'alias': 'bytes',
        'apply': 'derivative'
      }
    },
    'panel': {
      'title': 'Apache Bytes',
      'y_formats': [ 'bps' ]
    }
  };

  plugins.apache.connections = {
    'graph': {
      'apache_value': {
        'type': 'apache_connections',
        'color': '#00FF99',
        'alias': 'connections',
        'apply': 'max'
      }
    },
    'panel': {
      'title': 'Apache Connections',
      'y_formats': [ 'short' ]
    }
  };

  plugins.apache.idleWorkers = {
    'graph': {
      'apache_value': {
        'type': 'apache_idle_workers',
        'color': '#3636FF',
        'alias': 'idle_workers',
        'apply': 'max'
      }
    },
    'panel': {
      'title': 'Apache Idle Workers',
      'y_formats': [ 'short' ]
    }
  };

  plugins.apache.requests = {
    'graph': {
      'apache_value': {
        'type': 'apache_requests',
        'color': '#73E3EB',
        'alias': 'requests',
        'apply': 'derivative'
      }
    },
    'panel': {
      'title': 'Apache Requests',
      'y_formats': [ 'short' ]
    }
  };

  plugins.apache.apacheScoreboard = {
    'graph': {
      'open': { 'color': '#FCE94F' },
      'starting': { 'color': '#FCAF3E' },
      'reading': { 'color': '#8AE234' },
      'keepalive': { 'color': '#729FCF' },
      'dnslookup': { 'color': '#AD7FA8' },
      'logging': { 'color': '#EF2929' },
      'finishing': { 'color': '#D3D7CF' },
      'idle_cleanup': { 'color': '2E3436' },
      'waiting': { 'color': '#4E9A06' },
      'closing': { 'color': '#CE5C00' },
      'sending': { 'color': '#C4A000' }
    },
    'panel': {
      'title': 'Apache Scoreboard',
      'y_formats': [ 'short' ],
      'tooltip': { 'value_type': 'individual' }
    }
  };


  // collectd postgresql plugin configuration
  plugins.postgresql = new Plugin({ 'alias': 'psql' });
  plugins.postgresql.config.multi = true;

  plugins.postgresql.numBackends = {
    'graph': {
      'postgresql': { 'type': 'pg_numbackends' }
    },
    'panel': {
      'title': 'PostgreSQL Connected backends for @metric',
      'y_formats': [ 'short' ]
    }
  };

  plugins.postgresql.commitRollback = {
    'graph': {
      'postgresql': { 'type': 'pg_xact', 'apply': 'derivative' }
    },
    'panel': {
      'title': 'PostgreSQL Transactions for @metric',
      'y_formats': [ 'short' ]
    }
  };

  plugins.postgresql.ops = {
    'graph': {
      'postgresql': { 'type': 'pg_n_tup_c', 'apply': 'derivative' }
    },
    'panel': {
      'title': 'PostgreSQL Operations for @metric',
      'y_formats': [ 'short' ]
    }
  };

  plugins.postgresql.rows = {
    'graph': {
      'postgresql': { 'type': 'pg_n_tup_g', 'apply': 'derivative' }
    },
    'panel': {
      'title': 'PostgreSQL Rows for @metric',
      'y_formats': [ 'short' ]
    }
  };

  plugins.postgresql.idx = {
    'graph': {
      'idx': { 'type': 'pg_blks', 'apply': 'derivative' }
    },
    'panel': {
      'title': 'PostgreSQL Disk and Buffer Index Stats for @metric',
      'y_formats': [ 'short' ]
    }
  };

  plugins.postgresql.tidx = {
    'graph': {
      'tidx': { 'type': 'pg_blks', 'apply': 'derivative' }
    },
    'panel': {
      'title': 'PostgreSQL Disk and Buffer Stats for @metric',
      'y_formats': [ 'short' ]
    }
  };

  plugins.postgresql.dbSize = {
    'graph': {
      'postgresql': { 'type': 'pg_db_size', 'alias': 'size' }
    },
    'panel': {
      'title': 'PostgreSQL DB Size for @metric',
      'y_formats': [ 'short' ]
    }
  };


  // collectd zookeeper plugin configuration: https://github.com/signalfx/collectd-zookeeper
  plugins.zookeeper = new Plugin({ 'alias': 'zk' });
  plugins.zookeeper.config.multi = true;

  plugins.zookeeper.followers = {
    'graph': {
      'followers': { }
    },
    'panel': {
      'title': 'Zookeeper followers for @metric',
      'y_formats': [ 'short' ]
    }
  };

  plugins.zookeeper.conn = {
    'graph': {
      'connections': { }
    },
    'panel': {
      'title': 'Zookeeper connections for @metric',
      'y_formats': [ 'short' ]
    }
  };

  plugins.zookeeper.req = {
    'graph': {
      'requests': { 'apply': 'max' },
      'syncs': { 'apply': 'max' }
    },
    'panel': {
      'title': 'Zookeeper requests and syncs for @metric',
      'y_formats': [ 'short' ]
    }
  };

  plugins.zookeeper.watch = {
    'graph': {
      'watch_count': { 'apply': 'max' }
    },
    'panel': {
      'title': 'Zookeeper watches for @metric',
      'y_formats': [ 'short' ]
    }
  };

  plugins.zookeeper.leader = {
    'graph': {
      'is_leader': { 'apply': 'max' }
    },
    'panel': {
      'title': 'Zookeeper leader for @metric',
      'y_formats': [ 'short' ]
    }
  };

  plugins.zookeeper.nodes = {
    'graph': {
      'znode_count': { 'apply': 'max' },
      'ephemerals_count': { 'apply': 'max' }
    },
    'panel': {
      'title': 'Zookeeper nodes for @metric',
      'y_formats': [ 'short' ]
    }
  };

  plugins.zookeeper.data = {
    'graph': {
      'data_size': { }
    },
    'panel': {
      'title': 'Zookeeper data for @metric',
      'y_formats': [ 'bytes' ]
    }
  };

  plugins.zookeeper.files = {
    'graph': {
      'file_descriptor_count': { }
    },
    'panel': {
      'title': 'Zookeeper files for @metric',
      'y_formats': [ 'short' ]
    }
  };

  plugins.zookeeper.packets = {
    'graph': {
      'packets_sent': {
        'color': '#447EBC',
        'apply': 'derivative',
        'math': '* -1'
      },
      'packets_received': {
        'color': '#508642',
        'apply': 'derivative'
      }
    },
    'panel': {
      'title': 'Zookeeper packets for @metric',
      'grid': { 'max': null, 'min': null, 'leftMin': null },
      'y_formats': [ 'pps' ]
    }
  };

  plugins.zookeeper.latency = {
    'graph': {
      'latency': { }
    },
    'panel': {
      'title': 'Zookeeper latency for @metric',
      'y_formats': [ 'ms' ]
    }
  };


  // collectd mesos plugin configuration: https://github.com/rayrod2030/collectd-mesos
  plugins.mesos = new Plugin({ 'alias': 'mo' });

  plugins.mesos.cpus = {
    'graph': {
      '/(master|slave)_cpus_total/': { 'color': '#508642' },
      '/(master|slave)_cpus_used/': { 'color': '#447EBC' }
    },
    'panel': {
      'title': 'Mesos CPUs',
      'y_formats': [ 'short' ],
      'fill': 5
    }
  };

  plugins.mesos.cpusPercent = {
    'graph': {
      'cpus_percent': { 'math': '* 100' }
    },
    'panel': {
      'title': 'Mesos CPUs percent',
      'y_formats': [ 'percent' ],
      'fill': 5,
      'percentage': true
    }
  };

  plugins.mesos.load = {
    'graph': {
      'system_load': { }
    },
    'panel': {
      'title': 'Mesos System Load',
      'y_formats': [ 'short' ]
    }
  };

  plugins.mesos.memory = {
    'graph': {
      'mem_total': { 'color': '#508642' },
      'mem_used': { 'color': '#447EBC' }
    },
    'panel': {
      'title': 'Mesos Memory',
      'y_formats': [ 'mbytes' ],
      'fill': 5
    }
  };

  plugins.mesos.memPercent = {
    'graph': {
      'mem_percent': { 'math': '* 100' }
    },
    'panel': {
      'title': 'Mesos Memory percent',
      'y_formats': [ 'percent' ],
      'fill': 5,
      'percentage': true
    }
  };

  plugins.mesos.systemMem = {
    'graph': {
      'system_mem_total': { 'color': '#f08080' },
      'system_mem_free': { 'color': '#32cd32' }
    },
    'panel': {
      'title': 'Mesos System Memory',
      'y_formats': [ 'bytes' ],
      'fill': 5
    }
  };

  plugins.mesos.disk = {
    'graph': {
      'disk_total': { 'color': '#508642' },
      'disk_used': { 'color': '#447EBC' }
    },
    'panel': {
      'title': 'Mesos Disk',
      'y_formats': [ 'mbytes' ],
      'fill': 5
    }
  };

  plugins.mesos.diskPercent = {
    'graph': {
      'disk_percent': { 'math': '* 100' }
    },
    'panel': {
      'title': 'Mesos Disk percent',
      'y_formats': [ 'percent' ],
      'fill': 5,
      'percentage': true
    }
  };

  plugins.mesos.uptime = {
    'graph': {
      'uptime_secs': { }
    },
    'panel': {
      'title': 'Mesos Uptime',
      'y_formats': [ 's' ],
      'fill': 5
    }
  };

  plugins.mesos.slaveRegistered = {
    'graph': {
      'slave_registered': { }
    },
    'panel': {
      'title': 'Mesos Slave registered',
      'y_formats': [ 'short' ]
    }
  };

  plugins.mesos.masterElected = {
    'graph': {
      'master_elected': { }
    },
    'panel': {
      'title': 'Mesos Master elected',
      'y_formats': [ 'short' ]
    }
  };

  plugins.mesos.slaveRecoveryErrors = {
    'graph': {
      'slave_recovery_errors': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'Mesos Slave recovery errors/sec',
      'y_formats': [ 'ops' ]
    }
  };

  plugins.mesos.tasksGauge = {
    'graph': {
      'tasks_running': { },
      'tasks_staging': { },
      'tasks_starting': { }
    },
    'panel': {
      'title': 'Mesos tasks states',
      'y_formats': [ 'short' ]
    }
  };

  plugins.mesos.statusUpdates = {
    'graph': {
      'status_updates': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'Mesos status updates/sec',
      'y_formats': [ 'ops' ]
    }
  };

  plugins.mesos.tasksCounter = {
    'graph': {
      'tasks_error': { 'apply': 'derivative' },
      'tasks_failed': { 'apply': 'derivative' },
      'tasks_finished': { 'apply': 'derivative' },
      'tasks_killed': { 'apply': 'derivative' },
      'tasks_lost': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'Mesos tasks results/sec',
      'y_formats': [ 'ops' ]
    }
  };

  plugins.mesos.frameworks = {
    'graph': {
      'frameworks_active': { 'apply': 'max' },
      'frameworks_inactive': { 'apply': 'max' },
      'frameworks_connected': { 'apply': 'max' },
      'frameworks_disconnected': { 'apply': 'max' }
    },
    'panel': {
      'title': 'Mesos frameworks status',
      'y_formats': [ 'short' ]
    }
  };

  plugins.mesos.slaveExecutors = {
    'graph': {
      'slave_executors': { 'type': 'gauge' }
    },
    'panel': {
      'title': 'Mesos Slave executors states',
      'y_formats': [ 'short' ]
    }
  };

  plugins.mesos.slaveFrameworkMsg = {
    'graph': {
      'framework_messages': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'Mesos framework messages/sec',
      'y_formats': [ 'ops' ]
    }
  };

  plugins.mesos.masterFmwExecMsg = {
    'graph': {
      'framework_to_executor_messages': { 'apply': 'derivative' },
      'messages_exited_executor': { 'apply': 'derivative' },
      'messages_framework_to_executor': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'Mesos framework executor messages/sec',
      'y_formats': [ 'ops' ]
    }
  };

  plugins.mesos.masterFmwMsg = {
    'graph': {
      '_register_framework': { 'apply': 'derivative' },
      '_reregister_framework': { 'apply': 'derivative' },
      '_unregister_framework': { 'apply': 'derivative' },
      '_deactivate_framework': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'Mesos framework messages/sec',
      'y_formats': [ 'ops' ]
    }
  };

  plugins.mesos.masterOpMsg = {
    'graph': {
      'messages_authenticate': { 'apply': 'derivative' },
      'messages_status_update': { 'apply': 'derivative' },
      'messages_status_update_acknowledgement': { 'apply': 'derivative' },
      '_valid_status_updates': { 'apply': 'derivative' },
      '_valid_status_update_acknowledgements': { 'apply': 'derivative' },
      '_invalid_status_updates': { 'apply': 'derivative' },
      '_invalid_status_update_acknowledgements': { 'apply': 'derivative' },
      'messages_resource_request': { 'apply': 'derivative' },
      'dropped_messages': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'Mesos operation messages/sec',
      'y_formats': [ 'ops' ]
    }
  };

  plugins.mesos.masterSlaveMsg = {
    'graph': {
      '_register_slave': { 'apply': 'derivative' },
      '_reregister_slave': { 'apply': 'derivative' },
      '_unregister_slave': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'Mesos slave messages/sec',
      'y_formats': [ 'ops' ]
    }
  };

  plugins.mesos.masterOfferMsg = {
    'graph': {
      'messages_decline_offers': { 'apply': 'derivative' },
      'messages_revive_offers': { 'apply': 'derivative' },
      'outstanding_offers': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'Mesos offer messages/sec',
      'y_formats': [ 'ops' ]
    }
  };

  plugins.mesos.masterTaskMsg = {
    'graph': {
      'messages_kill_task': { 'apply': 'derivative' },
      'messages_launch_tasks': { 'apply': 'derivative' },
      'messages_reconcile_tasks': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'Mesos task messages/sec',
      'y_formats': [ 'ops' ]
    }
  };

  plugins.mesos.masterSlaveOps = {
    'graph': {
      'master_slave_': { 'apply': 'derivative' },
      'recovery_slave_removals': { 'apply': 'derivative' }
    },
    'panel': {
      'title': 'Mesos slave operations/sec',
      'y_formats': [ 'ops' ]
    }
  };

  plugins.mesos.masterSlaves = {
    'graph': {
      'master_slaves': { }
    },
    'panel': {
      'title': 'Mesos Master Slaves status',
      'y_formats': [ 'short' ]
    }
  };

  plugins.mesos.masterFwks = {
    'graph': {
      'master_frameworks': { }
    },
    'panel': {
      'title': 'Mesos Master Frameworks status',
      'y_formats': [ 'short' ]
    }
  };

  plugins.mesos.masterEventQueue = {
    'graph': {
      'master_event_queue': { }
    },
    'panel': {
      'title': 'Mesos Master Event Queue',
      'y_formats': [ 'short' ]
    }
  };

  plugins.mesos.masterRegStates = {
    'graph': {
      'registrar_state': { }
    },
    'panel': {
      'title': 'Mesos Master Registrar states',
      'y_formats': [ 'short' ]
    }
  };

  plugins.mesos.masterRegSize = {
    'graph': {
      'registrar_registry_size_bytes': { }
    },
    'panel': {
      'title': 'Mesos Master Registry size',
      'y_formats': [ 'bytes' ]
    }
  };

  plugins.mesos.masterRegQueue = {
    'graph': {
      'registrar_queued_operations': { }
    },
    'panel': {
      'title': 'Mesos Master Registry queued operations',
      'y_formats': [ 'short' ]
    }
  };


  return {
    'plugins': plugins
  };
});
